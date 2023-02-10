import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { AgentModel } from '../../../models';
import { FilterAgentDto, UpdateAgentEntityDto } from '../dto/AgentDto';
import { IAgentRepository } from '../repository/AgentRepositoryInterface';
import { IAgentService } from './AgentServiceInterface';
import { IGoongService } from '../../goongapi/service/GoongServiceInterface';
import { IOrderService } from '../../orders/service/order/OrderServiceInterface';
import { IForbiddenKeywordService } from '../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import { PaymentMethodEnum } from '../../orders/enum/PaymentEnum';
import { OrderStatusEnum, OrderTypeEnum } from '../../orders/enum/OrderEnum';
import { IAgentCategoryService } from '../../agent-categories/service/AgentCategoryServiceInterface';
import { IServiceService } from '../../services/service/ServiceServiceInterface';
import {
  CurrencyUnitEnum,
  ProductStatusEnum,
} from '../../products/enum/ProductEnum';
import { IProductService } from '../../products/service/products/ProductServiceInterface';
import { IServiceCategoryService } from '../../services/service/service-categories/ServiceCategoryServiceInterface';
import {removeVietnameseTones} from "../../../helpers/stringHelper";
import {
  ISectionAgentRelationService
} from "../../sections/section-agent-relation/service/SectionAgentRelationServiceInterface";
import {
  ISectionProductRelationService
} from "../../sections/section-product-relation/service/SectionProductRelationServiceInterface";

@Injectable()
export class AgentServiceImplementation implements IAgentService {
  constructor(
    @Inject(IAgentRepository) private agentRepository: IAgentRepository,
    @Inject(IGoongService) private goongService: IGoongService,
    @Inject(forwardRef(() => IOrderService))
    private orderService: IOrderService,
    @Inject(IForbiddenKeywordService)
    private forbiddenKeywordService: IForbiddenKeywordService,
    @Inject(IAgentCategoryService)
    private agentCategoryService: IAgentCategoryService,
    @Inject(IServiceService) private serviceService: IServiceService,
    @Inject(IProductService) private productService: IProductService,
    @Inject(IServiceCategoryService)
    private serviceCategoryService: IServiceCategoryService,
    @Inject(forwardRef(() => ISectionAgentRelationService))
    private sectionAgentService: ISectionAgentRelationService,
    @Inject(ISectionProductRelationService)
    private sectionProductService: ISectionProductRelationService,
  ) {}

  getAgentDetails(id: string): Promise<AgentModel> {
    try {
      return this.agentRepository.findOneById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAgentListByDistance(filterAgentDto: FilterAgentDto) {
    try {
      const {
        limit,
        page,
        longitude,
        latitude,
        distance,
        order_by,
        order_type,
        ...rest
      } = filterAgentDto;
      const condition = await this.buildSearchQueryCondition(rest);
      return await this.agentRepository.whereRaw(
        limit,
        (page - 1) * limit,
        condition,
        `
        (
            3959 *
            acos(cos(radians(${latitude})) *
            cos(radians(latitude)) *
            cos(radians(longitude) -
            radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians(latitude)))
         ) <= ${distance}`,
      );
    } catch (error) {
      throw error;
    }
  }

  getAgentListByDistanceWithoutPagination(condition: any): Promise<AgentModel[]> {
    try {
      const { distance, longitude, latitude, ...rest } = condition;
      const queryCondition = this.buildSearchQueryCondition(rest);
      return this.agentRepository.whereRawWithoutPagination(queryCondition, `(
            3959 *
            acos(cos(radians(${latitude})) *
            cos(radians(latitude)) *
            cos(radians(longitude) -
            radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians(latitude)))
         ) <= ${distance}`)
    } catch (error) {
      throw error;
    }
  }

  async updateAgent(
    id: string,
    payload: UpdateAgentEntityDto,
  ): Promise<[number, AgentModel[]]> {
    try {
      const agent = await this.getAgentDetails(id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      if (payload.category_id) {
        const category = await this.agentCategoryService.getAgentCategoryDetail(
          payload.category_id,
        );
        if (!category) {
          throw new Error('Agent category not found');
        }
        if (category.id !== '65a347b9-3c84-4e23-9856-c7245d7bdffd' && category.id !== 'd619d1a1-9313-4e9b-8a50-dd176177f0de') {
          const products =
              await this.productService.getProductListByConditionWithoutPagination({
                agent_id: agent.id,
              });
          const services = await this.serviceService.getServiceListByConditionWithoutPagination({
            agent_id: agent.id,
          });
          products.length && Promise.all(
            products.map(product => {
              product.update({ agent_category_id: category.id });
            }),
          );
          services.length && Promise.all(
            services.map(service => {
              service.update({ agent_category_id: category.id });
            }),
          );
        }
        if (category.id === '5530a10b-ffb8-43be-bb90-1d09c293cace') {
          const rescueServiceCategory =
            await this.serviceCategoryService.getServiceCategoryByCondition({
              name: 'Cứu hộ',
            });
          if (!rescueServiceCategory) {
            throw new Error('Service Category not found');
          }
          const rescueService = await this.serviceService.getServiceByCondition(
            {
              agent_id: id,
              name: 'Cứu hộ tại garage',
            },
          );
          if (!rescueService) {
            await this.serviceService.createService(
              {
                agent_id: agent.id,
                price: 0,
                is_rescue_service: true,
                is_guaranteed: false,
                name: 'Cứu hộ tại garage',
                currency_unit: CurrencyUnitEnum.VND,
                description: 'Dịch vụ cứu hộ tại garage',
                category_ids: [rescueServiceCategory.id],
              },
              agent.user_id,
            );
          }
        }
      }
      const checkForbiddenKeyword =
        await this.forbiddenKeywordService.checkKeywordExist(payload.name);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR',
        };
        throw data;
      }
      const params: Record<string, any> = {
        ...payload
      }
      if (params.name) {
        params.converted_name = removeVietnameseTones(payload.name).split(' ').filter(item => item !== "").join(' ');
      }
      return this.agentRepository.update(id, params);
    } catch (error) {
      throw error;
    }
  }

  async getAgentList(payload: FilterAgentDto): Promise<AgentModel[]> {
    try {
      const { limit, page, order_by, order_type, ...rest } = payload;
      const condition = await this.buildSearchQueryCondition(rest);
      const agents = await this.agentRepository.findAll(
        limit,
        (page - 1) * limit,
        condition,
        order_by,
        order_type,
      );
      return agents;
    } catch (error) {
      throw error;
    }
  }

  async getAgentListWithoutPaging(condition: any): Promise<AgentModel[]> {
    try {
      return await this.agentRepository.findAllWithoutPaging(condition);
    } catch (error) {
      throw error;
    }
  }

  async countAgentByCondition(payload: Record<string, any>): Promise<number> {
    try {
      const { limit, page, order_by, order_type, ...condition } = payload;
      const params = await this.buildSearchQueryCondition(condition);
      return this.agentRepository.count(params);
    } catch (error) {
      throw error;
    }
  }

  async countAgentByDistance(payload: Record<string, any>): Promise<number> {
    try {
      const {
        limit,
        page,
        longitude,
        latitude,
        distance,
        order_by,
        order_type,
        ...rest
      } = payload;
      const params = await this.buildSearchQueryCondition(rest);
      return this.agentRepository.countRaw(
        params,
        `
        (
            3959 *
            acos(cos(radians(${latitude})) *
            cos(radians(latitude)) *
            cos(radians(longitude) -
            radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians(latitude)))
         ) <= ${distance}`,
      );
    } catch (error) {
      throw error;
    }
  }

  getAgentDetailByCondition(condition: any): Promise<AgentModel> {
    return this.agentRepository.findOneByCondition(condition);
  }

  async buildSearchQueryCondition(conditionQuery: Record<string, any>) {
    let { service_category_id, ...condition } = conditionQuery;
    let conditionParams: Record<string, any> = {
      ...condition,
      is_deleted: false,
    };

    const removeKeys = ['limit', 'page', 'order_by', 'order_type'];
    for (const key of Object.keys(conditionParams)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete conditionParams[key];
        }
      }
    }

    if (service_category_id) {
      let agentIds = await this.agentRepository.getAgentIdsByServiceCategory(
        service_category_id,
      );
      conditionParams = {
        ...conditionParams,
        id: {
          [Op.in]: agentIds,
        },
      };
    }
    return conditionParams;
  }

  async updateGeoLocation(agentId: string, address: string): Promise<void> {
    try {
      const { data } = await this.goongService.getGeoLocation(address);
      const { results } = data;
      const { geometry } = results[0];

      await this.updateAgent(agentId, {
        geo_info: results,
        longitude: geometry.location.lng,
        latitude: geometry.location.lat,
      });
    } catch (error) {
      throw new Error('Cannot update geo location, address is invalid');
    }
  }

  async hideOrUnhideAgent(
    agentId: string,
    isHidden: boolean,
  ): Promise<boolean> {
    try {
      const agent = await this.getAgentDetails(agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const [nModified, _] = await this.agentRepository.update(agent.id, {
        is_hidden: isHidden,
      });
      const products =
        await this.productService.getProductListByConditionWithoutPagination({
          agent_id: agent.id,
        });
      if (nModified) {
        if (products.length) {
          const productIds = products.map((product) => product.id);
          if (isHidden) {
            Promise.all([
              this.productService.updateProductByCondition(
                { id: productIds },
                { status: ProductStatusEnum.INACTIVE },
              ),
              productIds.map(async (id: string) => {
                const sectionProductItem = await this.sectionProductService.getDetailByCondition({ product_id: id });
                if (sectionProductItem) {
                  await this.sectionProductService.deleteByCondition({
                    product_id: id,
                    section_id: sectionProductItem.section_id
                  })
                } else {
                  console.log('PRODUCT IS NOT IN SECTION PRODUCT');
                }
              }),
            ])
          } else {
            this.productService.updateProductByCondition(
              { id: productIds },
              { status: ProductStatusEnum.ACTIVE },
            )
          }
        }
        const sectionAgent = await this.sectionAgentService.getDetailByCondition({
          agent_id: agent.id,
        });
        if (sectionAgent) {
          await this.sectionAgentService.deleteByCondition({
            agent_id: agent.id,
            section_id: sectionAgent.section_id,
          });
        }
      }
      return !!nModified;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async activateOrDeactivateAgent(
    agentId: string,
    isActivated: boolean,
  ): Promise<boolean> {
    try {
      const agent = await this.getAgentDetails(agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const [nModified, _] = await this.agentRepository.update(agent.id, {
        is_activated: isActivated,
      });
      const products =
          await this.productService.getProductListByConditionWithoutPagination({
            agent_id: agent.id,
          });
      if (nModified && products.length) {
        const productIds = products.map((product) => product.id);
        this.productService.updateProductByCondition(
            { id: productIds },
            {
              status: !isActivated
                  ? ProductStatusEnum.INACTIVE
                  : ProductStatusEnum.ACTIVE,
            },
        );
      }
      return !!nModified;
    } catch (error) {
      throw error;
    }
  }

  async getAgentRevenue(agentId: string): Promise<any> {
    try {
      const agent = await this.getAgentDetails(agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const onlinePaymentOrders =
        await this.orderService.getOrderListByConditionWithoutPagination({
          payment_method: [PaymentMethodEnum.MOMO, PaymentMethodEnum.ONEPAY],
          status: OrderStatusEnum.COMPLETED,
          agent_id: agentId,
        });

      const offlinePaymentOrders =
        await this.orderService.getOrderListByConditionWithoutPagination({
          payment_method: PaymentMethodEnum.CASH,
          status: OrderStatusEnum.COMPLETED,
          agent_id: agentId,
        });

      const physicalPurchasesOrders =
        await this.orderService.getOrderListByConditionWithoutPagination({
          type: OrderTypeEnum.PHYSICAL_PURCHASED,
          status: OrderStatusEnum.COMPLETED,
          agent_id: agentId,
        });

      const bookingPurchasesOrders =
        await this.orderService.getOrderListByConditionWithoutPagination({
          type: OrderTypeEnum.BOOKING,
          status: OrderStatusEnum.COMPLETED,
          agent_id: agentId,
        });

      // TODO: update base cost when required
      const baseCost = 0;

      const data = {
        online_payment_revenue: onlinePaymentOrders
          .map((order) => order.value)
          .reduce((a, b) => a + b, 0),
        offline_payment_revenue: offlinePaymentOrders
          .map((order) => order.value)
          .reduce((a, b) => a + b, 0),
        physical_purchases_revenue: physicalPurchasesOrders
          .map((order) => order.value)
          .reduce((a, b) => a + b, 0),
        booking_purchases_orders: bookingPurchasesOrders
          .map((order) => order.value)
          .reduce((a, b) => a + b, 0),
        base_cost: baseCost,
      };

      return data;
    } catch (error) {
      throw error;
    }
  }
}

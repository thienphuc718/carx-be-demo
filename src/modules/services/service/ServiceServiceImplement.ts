import { forwardRef, Inject } from '@nestjs/common';
import { ServiceCategoryModel, ServiceModel } from '../../../models';

import {
  CreateServicePayloadDto,
  FilterServiceDto,
  UpdateServiceEntityDto,
  UpdateServicePayloadDto,
} from '../dto/ServiceDto';

import { UpdateProductPayloadDto } from '../../products/dto/ProductDto';

import { ProductStatusEnum, ProductTypeEnum } from '../../products/enum/ProductEnum';
import { ServiceExcelColumnEnum, ServiceGuaranteeTimeUnitEnum } from '../enum/ServiceEnum';

import { IServiceRepository } from '../repository/ServiceRepositoryInterface';
import { IServiceService } from './ServiceServiceInterface';
import { IProductService } from '../../products/service/products/ProductServiceInterface';
import { IServiceCategoryService } from './service-categories/ServiceCategoryServiceInterface';
import { IUserService } from '../../users/service/UserServiceInterface';
import { IForbiddenKeywordService } from '../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import { Op } from 'sequelize';
import { IServiceCategoryRelationService } from './service-category-relations/ServiceCategoryRelationServiceInterface';
import * as Excel from 'exceljs';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { AppGateway } from '../../../gateway/AppGateway';
import { removeVietnameseTones } from '../../../helpers/stringHelper';
import { IAgentService } from '../../agents/service/AgentServiceInterface';
import { isArray, isNil, uniqBy } from 'lodash';

export class ServiceServiceImplementation implements IServiceService {
  constructor(
    @Inject(IServiceRepository)
    private serviceRepository: IServiceRepository,
    @Inject(IProductService)
    private productService: IProductService,
    @Inject(forwardRef(() => IUserService)) private userService: IUserService,
    @Inject(forwardRef(() => IServiceCategoryService))
    private serviceCategoryService: IServiceCategoryService,
    @Inject(forwardRef(() => IForbiddenKeywordService))
    private forbiddenKeywordService: IForbiddenKeywordService,
    @Inject(IServiceCategoryRelationService)
    private serviceCategoryRelationService: IServiceCategoryRelationService,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(forwardRef(() => IAgentService))
    private agentService: IAgentService,
  ) {}

  async getServiceList(payload: FilterServiceDto): Promise<ServiceModel[]> {
    try {
      const {
        limit,
        page,
        category_id,
        distance,
        longitude,
        latitude,
        ...rest
      } = payload;
      const condition = this.buildSearchQueryCondition(rest);
      if (distance || latitude || longitude) {
        if (!(distance && latitude && longitude)) {
          throw new Error(
            'Missing required properties to find products by geolocation',
          );
        }
        const agents =
          await this.agentService.getAgentListByDistanceWithoutPagination({
            is_deleted: false,
            is_hidden: false,
            distance,
            longitude,
            latitude,
          });
        condition.agent_id = agents.map((agent) => agent.id);
      }
      if (category_id) {
        const relations =
          await this.serviceCategoryRelationService.getServiceCategoryRelationListByConditionWithoutPagination(
            { category_id: category_id }
          );
          condition.id = uniqBy(relations, 'service_id').map(item => item.service_id);
      }
      return this.serviceRepository.findAllByCondition(
        limit || undefined,
        limit && page ? (page - 1) * limit : undefined,
        condition,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getServiceByCondition(condition: any): Promise<ServiceModel> {
    try {
      return this.serviceRepository.findOneByCondition(condition);
    } catch (error) {
      throw error;
    }
  }

  async getServiceDetailAndAddViewCount(id: string): Promise<ServiceModel> {
    try {
      const service = await this.getServiceDetail(id);
      let currentServiceViewCount = service.view_count;
      service.update({ view_count: ++currentServiceViewCount });
      return service;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async countServiceByCondition(condition: any): Promise<number> {
    try {
      const { distance, longitude, latitude, category_id, ...rest } = condition;
      const conditionParams = this.buildSearchQueryCondition(rest);
      if (distance || latitude || longitude) {
        if (!(distance && latitude && longitude)) {
          throw new Error(
            'Missing required properties to find products by geolocation',
          );
        }
        const agents =
          await this.agentService.getAgentListByDistanceWithoutPagination({
            is_deleted: false,
            is_hidden: false,
            distance,
            longitude,
            latitude,
          });
        conditionParams.agent_id = agents.map((agent) => agent.id);
      }
      if (category_id) {
        const relations =
          await this.serviceCategoryRelationService.getServiceCategoryRelationListByConditionWithoutPagination(
            { category_id: category_id },
          );
        conditionParams.id = uniqBy(relations, 'service_id').map(item => item.service_id);
      }
      return this.serviceRepository.countByCondition(conditionParams);
    } catch (error) {
      throw error;
    }
  }

  async getServiceDetail(id: string): Promise<ServiceModel> {
    try {
      return this.serviceRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createService(
    payload: CreateServicePayloadDto,
    userId: string,
  ): Promise<ServiceModel> {
    try {
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) throw new Error('user is not exist');
      const agent = user.agent_details;
      if (!agent) throw new Error('current user is not an agent');
      if (payload.sku) {
        console.log(payload.sku);
        const existSku = await this.productService.checkProductSkuExist(
          payload.sku,
        );
        if (existSku) {
          throw new Error('SKU exists');
        }
      }
      const checkForbiddenKeywords =
        await this.forbiddenKeywordService.checkKeywordsExist([
          payload.name,
          payload.description,
        ]);
      if (checkForbiddenKeywords) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeywords,
          code: 'FORBIDDEN_KEYWORD_ERROR',
        };
        throw data;
      }

      const agent_id = agent.id;
      const { category_ids, ...productPayload } = payload;
      let serviceId: string;

      const callback = async (transaction: any, newProduct) => {
        const newService = await this.serviceRepository.create(
          {
            ...payload,
            product_id: newProduct.id,
            agent_id: agent_id,
            agent_category_id: agent.category_id,
            converted_name: payload.name
              ? removeVietnameseTones(payload.name)
                  .split(' ')
                  .filter((item) => item !== '').join(' ')
              : '',
          },
          transaction,
        );
        serviceId = newService.id;
        if (category_ids) {
          const bulkCreateServiceCategoryPayload = category_ids.map(
            (category_id) => ({
              service_id: newService.id,
              category_id,
            }),
          );
          await this.serviceRepository.bulkCreateServiceCategories(
            bulkCreateServiceCategoryPayload,
            transaction,
          );
        }
      };

      await this.productService.createProduct(
        {
          ...productPayload,
          type: ProductTypeEnum.SERVICE,
        },
        userId,
        callback,
      );

      return this.getServiceDetail(serviceId);
    } catch (error) {
      throw error;
    }
  }

  async updateService(
    id: string,
    payload: UpdateServicePayloadDto,
  ): Promise<ServiceModel> {
    try {
      const { category_ids } = payload;
      const serviceDetails = await this.serviceRepository.findById(id);
      if (!serviceDetails) {
        throw new Error('Service not found');
      }

      const checkForbiddenKeywords =
        await this.forbiddenKeywordService.checkKeywordsExist([
          payload.name,
          payload.description,
        ]);
      if (checkForbiddenKeywords) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeywords,
          code: 'FORBIDDEN_KEYWORD_ERROR',
        };
        throw data;
      }

      const updateServiceEntity: UpdateServiceEntityDto = {
        name: payload.name,
        note: payload.note,
        description: payload.description,
        other_info: payload.other_info,
      };
      if (payload.name) {
        updateServiceEntity.converted_name = removeVietnameseTones(payload.name)
          .split(' ')
          .filter((item) => item !== '').join(' ');
      }
      const updateProductPayload: UpdateProductPayloadDto = {
        images: payload.images,
        price: payload.price,
        discount_price: payload.discount_price,
        is_guaranteed: payload.is_guaranteed,
        guarantee_time_unit: payload.guarantee_time_unit,
        guarantee_time: payload.guarantee_time,
        status: payload.status,
      };
      await Promise.all([
        this.serviceRepository.update(id, updateServiceEntity),
        this.productService.updateProduct(
          serviceDetails.product_id,
          updateProductPayload,
        ),
        category_ids && this.updateServiceCategory(id, category_ids),
      ]);
      return this.getServiceDetail(id);
    } catch (error) {
      throw error;
    }
  }

  async updateServiceCategory(
    serviceId: string,
    categoryIds: string[],
  ): Promise<void> {
    try {
      const existedCategories =
        await this.serviceRepository.findServiceCategoryRelationsByCondition({
          service_id: serviceId,
        });
      const existedCategoryIds: string[] = existedCategories.map(
        (existedCat) => existedCat.category_id,
      );
      const createNewServiceCategoryIds: string[] = categoryIds.filter(
        (catId) => !existedCategoryIds.includes(catId),
      );
      const reSelectCategoryIds: string[] = categoryIds.filter((catId) =>
        existedCategories.find(
          (cat) => cat.category_id === catId && cat.is_deleted === true,
        ),
      );
      const removeCategoryIds: string[] = existedCategoryIds.filter(
        (existedId) => !categoryIds.includes(existedId),
      );
      if (createNewServiceCategoryIds.length) {
        const createNewServiceCategoryArray = createNewServiceCategoryIds.map(
          (category_id) => ({
            service_id: serviceId,
            category_id,
          }),
        );
        await this.serviceRepository.bulkCreateServiceCategories(
          createNewServiceCategoryArray,
          null,
        );
      }
      if (reSelectCategoryIds.length) {
        await Promise.all(
          reSelectCategoryIds.map((category_id) =>
            this.serviceRepository.updateServiceCategoryRelationByCondition(
              { is_deleted: false },
              { service_id: serviceId, category_id },
            ),
          ),
        );
      }
      if (removeCategoryIds.length) {
        await Promise.all(
          removeCategoryIds.map((category_id) =>
            this.serviceRepository.updateServiceCategoryRelationByCondition(
              { is_deleted: true },
              { service_id: serviceId, category_id },
            ),
          ),
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      const service = await this.serviceRepository.findById(id);
      const categories = service.categories;
      if (!service) {
        throw new Error('Service not found');
      }
      const callback = async (transaction: any) => {
        await Promise.all([
          this.serviceRepository.delete(id, transaction),
          ...categories.map((category) =>
            this.serviceRepository.updateServiceCategoryRelationByCondition(
              { is_deleted: true },
              { service_id: id, category_id: category.category_id },
              transaction,
            ),
          ),
        ]);
      };
      await this.productService.deleteProduct(service.product_id, callback);
    } catch (error) {
      throw error;
    }
  }

  async deleteMultiServices(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.deleteService(id)));
    } catch (error) {
      throw error;
    }
  }

  // async addServiceToCategory(payload: AddServiceToCategoryDto): Promise<ServicePayloadDto> {
  //   try {
  //     const service = await this.getServiceDetail(payload.service_id);
  //     const category = await this.serviceCategoryService.getServiceCategoryDetail(payload.category_id);
  //     if (!service) {
  //       throw new Error('Service not found');
  //     }
  //     if (!category) {
  //       throw new Error('Category not found');
  //     }
  //     await this.serviceRepository.addServiceToCategory(payload);
  //     return service;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getRelatedServices(
    service_id: string,
  ): Promise<[number, ServiceModel[]]> {
    try {
      const service = await this.getServiceDetail(service_id);
      if (!service) {
        throw new Error('Service not found');
      }
      const agent_id = service.agent_id;
      const params = {
        agent_id: agent_id,
        is_deleted: false,
      };
      return Promise.all([
        this.countServiceByCondition(params),
        this.serviceRepository.findAllByConditionRandomlyOrdered(10, 0, params),
      ]);
    } catch (error) {
      throw error;
    }
  }

  async bulkUpload(file: any, userId: string): Promise<any> {
    try {
      let result = null;
      const EXCEL_MIMETYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // if not excel file
      if (file.mimetype !== EXCEL_MIMETYPE) {
        this.appGateway.server.emit(`ROOM_${userId}`, {
          action: 'EVENT_SERVICE_BULK_IMPORT',
          data: {
            success: 0,
            message: 'Invalid file',
          },
          channel: 'CARX_SERVICE',
        });
        return 0;
      }

      const lstCreateServices: CreateServicePayloadDto[] = [];
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file.buffer);

      const lstServiceCategory: ServiceCategoryModel[] =
        await this.serviceCategoryService.getAllServiceCategory();

      // Iterate over all rows (including empty rows) in a worksheet
      // Only get data from first sheet
      workbook.worksheets[0].eachRow(
        { includeEmpty: true },
        (row, rowNumber) => {
          if (rowNumber > 1) {
            // skip header row
            let guaranteeTime = 0;
            let guaranteeTimeUnit = ServiceGuaranteeTimeUnitEnum.DAY;
            if (row.values[ServiceExcelColumnEnum.DAY_GUARANTEE_TIME]) {
              guaranteeTime =
                row.values[ServiceExcelColumnEnum.DAY_GUARANTEE_TIME];
              guaranteeTimeUnit = ServiceGuaranteeTimeUnitEnum.DAY;
            } else if (
              row.values[ServiceExcelColumnEnum.MONTH_GUARANTEE_TIME]
            ) {
              guaranteeTime =
                row.values[ServiceExcelColumnEnum.MONTH_GUARANTEE_TIME];
              guaranteeTimeUnit = ServiceGuaranteeTimeUnitEnum.MONTH;
            } else if (row.values[ServiceExcelColumnEnum.YEAR_GUARANTEE_TIME]) {
              guaranteeTime =
                row.values[ServiceExcelColumnEnum.YEAR_GUARANTEE_TIME];
              guaranteeTimeUnit = ServiceGuaranteeTimeUnitEnum.YEAR;
            }

            let images = [];
            if (row.values[ServiceExcelColumnEnum.IMAGES]) {
              if (row.values[ServiceExcelColumnEnum.IMAGES].text) {
                images = [row.values[ServiceExcelColumnEnum.IMAGES].text];
              } else {
                images = [row.values[ServiceExcelColumnEnum.IMAGES]];
              }
            }

            let category_ids = [];
            let serviceCategory: ServiceCategoryModel;
            if (row.values[ServiceExcelColumnEnum.CATEGORY_IDS]) {
              const categoryNames =
                row.values[ServiceExcelColumnEnum.CATEGORY_IDS].split('\n'); // each category is separated in a new line

              for (const categoryName of categoryNames) {
                serviceCategory = lstServiceCategory.find(
                  (sc) => sc.name.toLowerCase() === categoryName.toLowerCase(),
                );

                if (serviceCategory) {
                  category_ids.push(serviceCategory.id);
                } else {
                  // category_ids.push(`${categoryName} is not valid category`);
                }
              }
            }

            const rowData = {
              sku: row.values[ServiceExcelColumnEnum.SERVICE_CODE],
              images: images,
              category_ids: category_ids,
              name: row.values[ServiceExcelColumnEnum.NAME],
              price: row.values[ServiceExcelColumnEnum.PRICE] ?? 0,
              discount_price:
                row.values[ServiceExcelColumnEnum.DISCOUNT_PRICE] ?? 0,
              is_guaranteed: !!row.values[ServiceExcelColumnEnum.DISCOUNT_PRICE],
              guarantee_time: guaranteeTime,
              guarantee_time_unit: guaranteeTimeUnit,
              guarantee_note: row.values[ServiceExcelColumnEnum.GUARANTEE_NOTE],
              description: row.values[ServiceExcelColumnEnum.DESCRIPTION],
            };

            const createServicetDto: CreateServicePayloadDto = plainToClass(
              CreateServicePayloadDto,
              rowData,
              {
                excludeExtraneousValues: false,
                enableImplicitConversion: false,
              },
            );

            if (createServicetDto.name) {
              lstCreateServices.push(createServicetDto);
            }
          }
        },
      );

      // if excel sheet is empty
      if (lstCreateServices.length === 0) {
        this.appGateway.server.emit(`ROOM_${userId}`, {
          action: 'EVENT_SERVICE_BULK_IMPORT',
          data: {
            success: 0,
            message: 'There is no data detected',
          },
          channel: 'CARX_SERVICE',
        });
        return 0;
      }

      // validate data
      const validatorOptions: ValidatorOptions = {
        whitelist: true, // strips all properties that don't have any decorators
        skipMissingProperties: false,
        skipUndefinedProperties: false,
        forbidUnknownValues: true,
        validationError: {
          target: false,
          value: true,
        },
      };

      let rowIdx = 0;
      const errorRows = [];
      for (const serviceDto of lstCreateServices) {
        rowIdx++;
        let errorMessages = [];
        const errors = await validate(serviceDto, validatorOptions);

        const categoryErrors = serviceDto.category_ids.filter((sc) =>
          sc.endsWith('is not valid category'),
        );

        if (categoryErrors.length > 0) {
          errorMessages = errorMessages.concat(categoryErrors);
        }

        if (errors.length > 0) {
          errors.map(
            (err) =>
              (errorMessages = errorMessages.concat(
                Object.values(err.constraints),
              )),
          );
        }

        if (errorMessages.length > 0) {
          errorRows.push({ row: rowIdx, errors: errorMessages });
        }
      }

      if (errorRows.length > 0) {
        this.appGateway.server.emit(`ROOM_${userId}`, {
          action: 'EVENT_SERVICE_BULK_IMPORT',
          data: {
            success: 0,
            data: errorRows,
            message: 'There is invalid data detected',
          },
          channel: 'CARX_SERVICE',
        });
        return 0;
      }

      let importResult = [];
      let index = 0;
      // import service
      for (const serviceDto of lstCreateServices) {
        try {
          index++;
          let service = await this.createService(
            {
              ...serviceDto,
            },
            userId,
          );
          importResult.push({
            success: 1,
            row: index,
            data: service,
          });
        } catch (error) {
          importResult.push({
            success: 0,
            row: index,
            data: error.message,
          });
        }
      }
      this.appGateway.server.emit(`ROOM_${userId}`, {
        action: 'EVENT_SERVICE_BULK_IMPORT',
        data: {
          success: 1,
          message: 'Successfully import services',
          result: importResult,
        },
        channel: 'CARX_SERVICE',
      });
      return 0;
    } catch (error) {
      this.appGateway.server.emit(`ROOM_${userId}`, {
        action: 'EVENT_SERVICE_BULK_IMPORT',
        data: error,
        channel: 'CARX_SERVICE',
      });
      return 0;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    const { is_status_included = true, ...rest } = condition;
    let queryCondition: Record<string, any> = {
      ...rest,
      is_deleted: false,
    };

    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }

    if (queryCondition.max_price || queryCondition.min_price) {
      if (queryCondition.max_price < 1) {
        throw new Error('Max price must be higher than 1');
      }
      if (queryCondition.min_price > queryCondition.max_price) {
        throw new Error('Min price and max price must be smaller than max price');
      }
      delete queryCondition.max_price;
      delete queryCondition.min_price;
      queryCondition = {
        ...queryCondition,
        variantCondition: {
          is_deleted: false,
          price: {
            ...(condition.min_price && {[Op.gte]: condition.min_price}),
            ...(condition.max_price && {[Op.lte]: condition.max_price}),
          },
        },
      }
    }
    const productCondition: Record<string, any> = {
      is_deleted: false,
    }
    // NOTE: is_status_included is used to define if product status will be claimed as ACTIVE or all
    if ((isNil(condition.agent_id) || !isArray(condition.agent_id)) && is_status_included) {
      productCondition.status = ProductStatusEnum.ACTIVE;
    }
    queryCondition.productCondition = productCondition;
    return queryCondition;
  }

  getServiceListByConditionWithoutPagination(
    condition: any,
  ): Promise<ServiceModel[]> {
    return this.serviceRepository.findAllByConditionWithoutPagination(
      condition,
    );
  }

  getMostViewCountService(): Promise<ServiceModel[]> {
    return this.serviceRepository.findAllByCondition(
      20,
      0,
      { is_deleted: false, is_rescue_service: false, productCondition: { status: ProductStatusEnum.ACTIVE } },
      'view_count',
      'desc',
    );
  }

  async addViewCount(serviceId: string): Promise<ServiceModel> {
    try {
      const service = await this.getServiceDetail(serviceId);
      if (!service) {
        throw new Error('Product not found');
      }
      let currentViewCount = service.view_count;
      const nModified = await this.serviceRepository.update(service.id, {
        view_count: ++currentViewCount,
      });
      if (!nModified) {
        throw new Error('Cannot update product view count');
      }
      return this.getServiceDetail(service.id);
    } catch (error) {
      throw error;
    }
  }

  updateServiceByCondition(condition: any, payload: UpdateServicePayloadDto) {
    try {
      this.serviceRepository.updateByCondition(condition, payload);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

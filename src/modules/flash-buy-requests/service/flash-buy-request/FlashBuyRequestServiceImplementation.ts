import { forwardRef, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { FlashBuyRequestModel } from '../../../../models';
import {
  FilterFlashBuyRequestDto,
  CreateFlashBuyRequestDto,
  UpdateFlashBuyRequestDto,
} from '../../dto/FlashBuyRequestDto';
import { IFlashBuyRequestRepository } from '../../repository/flash-buy-request/FlashBuyRequestRepositoryInterface';
import { IFlashBuyRequestService } from './FlashBuyRequestServiceInterface';
import { AppGateway } from '../../../../gateway/AppGateway';
import {
  FlashBuyActionEnum,
  FlashBuyResponseStatusEnum,
} from '../../enum/FlashBuyResponseEnum';
import { IFlashBuyResponseService } from '../flash-buy-response/FlashBuyResponseServiceInterface';
import { INotificationService } from '../../../notifications/service/NotificationServiceInterface';
import { NotificationSegmentEnum, NotificationTypeEnum } from '../../../notifications/enum/NotificationEnum';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { IPushNotificationService } from '../../../push-notifications/service/PushNotificationInterface';
import { ICustomerService } from '../../../customers/service/customer/CustomerServiceInterface';
import { IForbiddenKeywordService } from '../../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import {removeVietnameseTones} from "../../../../helpers/stringHelper";

export class FlashBuyRequestServiceImplementation
  implements IFlashBuyRequestService
{
  constructor(
    @Inject(IFlashBuyRequestRepository)
    private flashBuyRequestRepository: IFlashBuyRequestRepository,
    @Inject(forwardRef(() => IFlashBuyResponseService))
    private flashBuyResponseService: IFlashBuyResponseService,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(forwardRef(() => IAgentService))
    private agentService: IAgentService,
    @Inject(IPushNotificationService)
    private pushNotificationService: IPushNotificationService,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(IForbiddenKeywordService)
    private forbiddenKeywordService: IForbiddenKeywordService,
  ) {}

  async getAllFlashBuyRequests(
    payload: FilterFlashBuyRequestDto,
  ): Promise<FlashBuyRequestModel[]> {
    try {
      const { limit, page, agent_id, ...rest } = payload;
      const condition = this.buildSearchQueryCondition(rest);
      let flashBuyRequests = null;
      if (agent_id) {
        const agentRejectedResponses =
          await this.flashBuyResponseService.getFlashBuyResponseListByCondition(
            {
              agent_id: agent_id,
              status: FlashBuyResponseStatusEnum.REJECTED,
            },
          );
        const agentRejectedRequestIds = agentRejectedResponses.map(
          (response) => response.flash_buy_request_id,
        );
        const queryCondition = {
          ...condition,
          id: {
            [Op.notIn]: agentRejectedRequestIds,
          },
        };
        flashBuyRequests =
          await this.flashBuyRequestRepository.findAllWithCondition(
            limit,
            (page - 1) * limit,
            queryCondition,
          );
      } else {
        flashBuyRequests =
          await this.flashBuyRequestRepository.findAllWithCondition(
            limit,
            (page - 1) * limit,
            condition,
          );
      }
      return flashBuyRequests;
    } catch (error) {
      throw error;
    }
  }

  getFlashBuyRequestDetail(id: string): Promise<FlashBuyRequestModel> {
    try {
      return this.flashBuyRequestRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  getFlashBuyRequestDetailByCondition(
    condition: any,
  ): Promise<FlashBuyRequestModel> {
    try {
      return this.flashBuyRequestRepository.findOneByCondition(condition);
    } catch (error) {
      throw error;
    }
  }

  async createFlashBuyRequest(
    payload: CreateFlashBuyRequestDto,
  ): Promise<FlashBuyRequestModel> {
    try {
      const customer = await this.customerService.getCustomerDetail(payload.customer_id, 'public');
      if (!customer) {
        throw new Error('Customer not found');
      }
      const checkForbiddenKeyword = await this.forbiddenKeywordService.checkKeywordsExist([
        payload.product_name,
        payload.product_description ? payload.product_description  : '',
      ]);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      const params: Record<string, any> = {
        ...payload,
        converted_product_name: removeVietnameseTones(payload.product_name).split(' ').filter(item => item !== "").join(' '),
      }
      const createdFlashBuyRequest =
        await this.flashBuyRequestRepository.create(params);
      this.appGateway.server.emit('GENERAL_AGENT_EVENTS', {
        action: FlashBuyActionEnum.CREATE_FLASH_BUY_REQUEST,
        data: {
          flash_buy_id: createdFlashBuyRequest.id,
        },
        channel: 'CARX_FLASH_BUYS',
      });
      await this.notificationService.createNotification({
        message: `Khách hàng ${customer.full_name || ''} vừa tạo yêu cầu flash buy`,
        data: {
          flash_buy_request_id: createdFlashBuyRequest.id,
        },
        target_group: NotificationSegmentEnum.AGENT,
        type: NotificationTypeEnum.CUSTOMER_CREATE_FLASH_BUY_REQUEST,
      });
      this.pushNotificationService.pushNotification({
        included_segments: ['Subscribed Users'],
        ios_badgeType: 'Increase',
        ios_badgeCount: 1,
        contents: {
          en: `Customer ${customer.full_name || ''} has created a new flash buy request`,
          vi: `Khách hàng ${customer.full_name || ''} đã tạo yêu cầu Flash Buy mới`
        },
        headings: {
          en: `Flash Buy Request`,
          vi: `Yêu cầu Flash Buy`
        },
        data: {
          flash_buy_request_id: createdFlashBuyRequest.id,
          type: NotificationTypeEnum.CUSTOMER_CREATE_FLASH_BUY_REQUEST
        },
      }, NotificationSegmentEnum.AGENT);
      return createdFlashBuyRequest;
    } catch (error) {
      throw error;
    }
  }
  async updateFlashBuyRequest(
    id: string,
    payload: UpdateFlashBuyRequestDto,
  ): Promise<FlashBuyRequestModel> {
    try {
      const { agent_id, ...rest } = payload;
      const [nModified, flashBuyRequests] =
        await this.flashBuyRequestRepository.update(id, rest);
      if (!nModified) {
        throw new Error('Cannot update Flash Buy');
      }
      const updatedFlashBuyRequest = await this.getFlashBuyRequestDetail(flashBuyRequests[0].id);
      if (payload.is_done && payload.is_done === true) {
        if (!agent_id) {
          throw new Error('Missing agent_id');
        }
        const agent = await this.agentService.getAgentDetails(agent_id);
        if (!agent) {
          throw new Error('Agent not found');
        }
        const customer = await this.customerService.getCustomerDetail(updatedFlashBuyRequest.customer_id, 'public');
        if (!customer) {
          throw new Error('Customer not found');
        }
        // await this.notificationService.createUserInAppAndPushNotification(
        //   {
        //     userId: agent.user_id,
        //     message: `Khách hàng ${customer.full_name || ''} chấp nhận báo giá Flash Buy của bạn`,
        //     heading: `Yêu cầu Flash Buy`,
        //     targetGroup: NotificationSegmentEnum.AGENT,
        //     data: { flash_buy_request_id: updatedFlashBuyRequest.id },
        //     type: NotificationTypeEnum.CUSTOMER_ACCEPT_FLASH_BUY_RESPONSE,
        //     image: customer.avatar ?? null,
        //   }
        // );
        const flashBuyResponses = await this.flashBuyResponseService.getFlashBuyResponseListByCondition({
          flash_buy_request_id: updatedFlashBuyRequest.id,
        });
        flashBuyResponses.length && Promise.all([
          flashBuyResponses.map(response => response.destroy()),
        ]);
      }
      return updatedFlashBuyRequest;
    } catch (error) {
      throw error;
    }
  }
  deleteFlashBuyRequest(id: string): void {
    this.flashBuyRequestRepository.delete(id);
  }
  async countFlashBuyRequestByCondition(condition: any): Promise<number> {
    const { agent_id, ...rest } = condition;
    const queryCondition = this.buildSearchQueryCondition(rest);
    if (agent_id) {
      const agentRejectedResponses =
        await this.flashBuyResponseService.getFlashBuyResponseListByCondition(
          {
            agent_id: agent_id,
            status: FlashBuyResponseStatusEnum.REJECTED,
          },
        );
      const agentRejectedRequestIds = agentRejectedResponses.map(
        (response) => response.flash_buy_request_id,
      );
      return this.flashBuyRequestRepository.countByCondition({
        ...queryCondition,
        id: {
          [Op.notIn]: agentRejectedRequestIds,
        },
      });
    }
    return this.flashBuyRequestRepository.countByCondition(queryCondition);
  }

  async getNumberNotYetResponsesFlashBuyRequestByAgentId(agent_id: string): Promise<number> {
    try {
      const agent = await this.agentService.getAgentDetails(agent_id);
      let nRequests = 0;
      let nResponses = 0;
      if (!agent) {
        throw new Error('Agent not found');
      } else {
        nRequests = await this.countFlashBuyRequestByCondition({
          is_done: false,
        });
        nResponses = await this.flashBuyResponseService.countFlashBuyResponseByCondition({
          agent_id: agent_id,
        });
        if (nRequests < nResponses) {
          return 0;
        }
      }
      return nRequests - nResponses; 
    } catch (error) {
      throw error;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    };
    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    return queryCondition;
  }
}

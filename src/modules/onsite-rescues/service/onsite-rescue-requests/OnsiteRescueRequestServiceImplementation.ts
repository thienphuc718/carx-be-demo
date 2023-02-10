import { forwardRef, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { AppGateway } from '../../../../gateway/AppGateway';
import {
  OnsiteRescueRequestModel,
  OnsiteRescueResponseModel,
} from '../../../../models';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { ICustomerService } from '../../../customers/service/customer/CustomerServiceInterface';
import { IForbiddenKeywordService } from '../../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import {
  NotificationRescueFlagEnum,
  NotificationSegmentEnum,
  NotificationTypeEnum
} from '../../../notifications/enum/NotificationEnum';
import { INotificationService } from '../../../notifications/service/NotificationServiceInterface';
import { IPushNotificationService } from '../../../push-notifications/service/PushNotificationInterface';
import {
  CreateOnsiteRescueRequestDto,
  FilterOnsiteRescueRequestDto,
  UpdateOnsiteRescueRequestDto,
} from '../../dto/OnsiteRescueRequestDto';
import { OnsiteRescueRequestStatusEnum } from '../../enum/OnsiteRescueRequestEnum';
import { OnsiteRescueResponseStatusEnum } from '../../enum/OnsiteRescueResponseEnum';
import { IOnsiteRescueRequestRepository } from '../../repository/onsite-rescue-requests/OnsiteRescueRequestRepositoryInterface';
import { IOnsiteRescueResponseService } from '../onsite-rescue-responses/OnsiteRescueResponseServiceInterface';
import { IOnsiteRescueRequestService } from './OnsiteRescueRequestServiceInterface';
import { IBookingService } from "../../../bookings/service/BookingServiceInterface";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {IServiceService} from "../../../services/service/ServiceServiceInterface";

export class OnsiteRescueRequestServiceImplementation
  implements IOnsiteRescueRequestService
{
  constructor(
    @Inject(IOnsiteRescueRequestRepository)
    private onsiteRescueRequestRepository: IOnsiteRescueRequestRepository,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(forwardRef(() => IOnsiteRescueResponseService))
    private onsiteRescueResponseService: IOnsiteRescueResponseService,
    @Inject(INotificationService) private notificationService: INotificationService,
    @Inject(IPushNotificationService) private pushNotificationService: IPushNotificationService,
    @Inject(IForbiddenKeywordService) private forbiddenKeywordService: IForbiddenKeywordService,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(IBookingService) private bookingService: IBookingService,
    private eventEmitter: EventEmitter2,
    @Inject(IServiceService) private serviceService: IServiceService,
  ) {}

  async createOnsiteRescueRequest(
    payload: CreateOnsiteRescueRequestDto,
  ): Promise<OnsiteRescueRequestModel> {
    try {
      const customer = await this.customerService.getCustomerDetail(
        payload.customer_id,
        'public',
      );
      if (!customer) {
        throw new Error('Customer not found');
      }
      const checkForbiddenKeywords = await this.forbiddenKeywordService.checkKeywordsExist([
        payload.customer_info.full_name,
        payload.rescue_reason,
      ]);
      if (checkForbiddenKeywords) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeywords,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      const createdOnsiteRescueRequest = await this.getCurrentOnsiteRescueRequest(customer.id);
      if (createdOnsiteRescueRequest) {
        throw new Error('Onsite rescue response has been created');
      }
      const newOnsiteRescueRequest =
        await this.onsiteRescueRequestRepository.create(payload);
      this.appGateway.server.emit('SEND_ONSITE_RESCUE_REQUEST', {
        action: 'SEND_ONSITE_RESCUE_REQUEST',
        data: {
          onsite_rescue_request_id: newOnsiteRescueRequest.id,
          flag: NotificationRescueFlagEnum.ONSITE,
        },
        channel: 'CARX_ONSITE_RESCUE',
      });
      this.eventEmitter.emit('SEND_ONSITE_RESCUE_REQUEST_NOTIFICATION', {
        onsiteRescueRequestId: newOnsiteRescueRequest.id,
        customerInfo: customer.full_name || customer.phone_number,
        image: customer.avatar ?? null,
      })
      return newOnsiteRescueRequest;
    } catch (error) {
      throw error;
    }
  }
  async getOnsiteRescueRequestList(
    payload: FilterOnsiteRescueRequestDto,
  ): Promise<
    Array<OnsiteRescueRequestModel & { response?: OnsiteRescueResponseModel }>
  > {
    try {
      const { limit, page, agent_id, ...rest } = payload;
      let onsiteRescueRequests = null;
      if (agent_id) {
        const agentRejectedResponse =
          await this.onsiteRescueResponseService.getOnsiteRescueResponseByConditionWithoutPagination(
            {
              agent_id: agent_id,
              status: OnsiteRescueResponseStatusEnum.CANCELLED,
            },
          );
        const rejectedRequestIds = agentRejectedResponse.map(
          (response) => response.onsite_rescue_request_id,
        );
        const queryCondition = {
          ...rest,
          id: {
            [Op.notIn]: rejectedRequestIds,
          },
        };
        const rescueService = await this.serviceService.getServiceByCondition({
          name: 'Cứu hộ tại chỗ',
          agent_id,
          is_deleted: false
        });
        if (!rescueService) {
          return [];
        }
        onsiteRescueRequests =
          await this.onsiteRescueRequestRepository.findAllByCondition(
            limit,
            (page - 1) * limit,
            queryCondition,
          );
      } else {
        onsiteRescueRequests =
          await this.onsiteRescueRequestRepository.findAllByCondition(
            limit,
            (page - 1) * limit,
            rest,
          );
      }
      return onsiteRescueRequests;
    } catch (error) {
      throw error;
    }
  }

  getOnsiteRescueRequestDetail(id: string): Promise<OnsiteRescueRequestModel> {
    return this.onsiteRescueRequestRepository.findById(id);
  }

  getOnsiteRescueRequestByCondition(
    condition: any,
  ): Promise<OnsiteRescueRequestModel> {
    return this.onsiteRescueRequestRepository.findOneByCondition(condition);
  }

  getCurrentOnsiteRescueRequest(
    customerId: string,
  ): Promise<OnsiteRescueRequestModel> {
    return this.onsiteRescueRequestRepository.getCurrentOfCustomer(customerId);
  }
  async updateOnsiteRescueRequest(
    id: string,
    payload: UpdateOnsiteRescueRequestDto,
  ): Promise<OnsiteRescueRequestModel> {
    try {
      const [nModified, onsiteRescueRequests] =
        await this.onsiteRescueRequestRepository.update(id, payload);
      if (!nModified) {
        throw new Error('Cannot update onsite rescue request');
      }
      const onsiteRescueRequest = await this.getOnsiteRescueRequestDetail(onsiteRescueRequests[0].id);
      if (
        payload.status &&
        payload.status === OnsiteRescueRequestStatusEnum.COMPLETED &&
        onsiteRescueRequest.status === OnsiteRescueRequestStatusEnum.COMPLETED
      ) {
        const onsiteRescueResponses = await this.onsiteRescueResponseService.getOnsiteRescueResponseByConditionWithoutPagination({
          onsite_rescue_request_id: onsiteRescueRequest.id,
        });
        onsiteRescueResponses.length && Promise.all([
          onsiteRescueResponses.map(response => response.destroy()),
        ]);
      }
      if (
          payload.status &&
          payload.status === OnsiteRescueRequestStatusEnum.CANCELLED &&
          onsiteRescueRequest.status === OnsiteRescueRequestStatusEnum.CANCELLED
      ) {
        const onsiteRescueResponses = await this.onsiteRescueResponseService.getOnsiteRescueResponseByConditionWithoutPagination({
          onsite_rescue_request_id: onsiteRescueRequest.id,
        });
        onsiteRescueResponses.length && Promise.all([
          onsiteRescueResponses.map(response => response.destroy()),
        ]);
        if (onsiteRescueRequest.booking_id) {
          await this.bookingService.cancelBooking(onsiteRescueRequest.booking_id, 'Huỷ yêu cầu kéo xe cứu hộ', onsiteRescueRequest.customer.user_id);
        }
      }
      return onsiteRescueRequest;
    } catch (error) {
      throw error;
    }
  }
  async countOnsiteRescueRequestByCondition(condition: any): Promise<number> {
    const { limit, page, agent_id, ...rest } = condition;
    if (agent_id) {
      const agentRejectedResponse =
        await this.onsiteRescueResponseService.getOnsiteRescueResponseByConditionWithoutPagination(
          {
            agent_id: agent_id,
            status: OnsiteRescueResponseStatusEnum.CANCELLED,
          },
        );
      const rejectedRequestIds = agentRejectedResponse.map(
        (response) => response.onsite_rescue_request_id,
      );
      const rescueService = await this.serviceService.getServiceByCondition({
        name: 'Cứu hộ tại chỗ',
        agent_id,
        is_deleted: false
      });
      if (!rescueService) {
        return 0;
      }
      return this.onsiteRescueRequestRepository.countByCondition({
        ...rest,
        id: {
          [Op.notIn]: rejectedRequestIds,
        },
      });
    }
    return this.onsiteRescueRequestRepository.countByCondition(rest);
  }

  async getNotYetResponseOnsiteRescueRequestByAgentId(agent_id: string): Promise<number> {
    try {
      const agent = await this.agentService.getAgentDetails(agent_id);
      const rescueService = await this.serviceService.getServiceByCondition({
        name: 'Cứu hộ tại chỗ',
        agent_id: agent.id,
        is_deleted: false
      });
      if (!rescueService) {
        return 0;
      }
      let nRequests = 0;
      let nResponses = 0;
      if (!agent) {
        throw new Error('Agent Not Found');
      } else {
        nRequests = await this.onsiteRescueRequestRepository.countByCondition({
          status: OnsiteRescueRequestStatusEnum.SENT,
        });
        nResponses = await this.onsiteRescueResponseService.countOnsiteRescueResponseByCondition({
          agent_id: agent.id
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
}

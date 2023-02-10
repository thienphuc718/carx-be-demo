import { forwardRef, Inject } from '@nestjs/common';
import { AppGateway } from '../../../../gateway/AppGateway';
import { OnsiteRescueResponseModel } from '../../../../models';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import {
  NotificationRescueFlagEnum,
  NotificationSegmentEnum,
  NotificationTypeEnum
} from '../../../notifications/enum/NotificationEnum';
import { INotificationService } from '../../../notifications/service/NotificationServiceInterface';
import { IPushNotificationService } from '../../../push-notifications/service/PushNotificationInterface';
import { IServiceService } from '../../../services/service/ServiceServiceInterface';
import {
  CreateOnsiteRescueResponseDto,
  FilterOnsiteRescueResponseDto,
  UpdateOnsiteRescueResponseDto,
} from '../../dto/OnsiteRescueResponseDto';
import { OnsiteRescueRequestStatusEnum } from '../../enum/OnsiteRescueRequestEnum';
import { OnsiteRescueResponseStatusEnum } from '../../enum/OnsiteRescueResponseEnum';
import { IOnsiteRescueResponseRepository } from '../../repository/onsite-rescue-responses/OnsiteRescueResponseRepositoryInterface';
import { IOnsiteRescueRequestService } from '../onsite-rescue-requests/OnsiteRescueRequestServiceInterface';
import { IOnsiteRescueResponseService } from './OnsiteRescueResponseServiceInterface';

export class OnsiteRescueResponseServiceImplementation
  implements IOnsiteRescueResponseService
{
  constructor(
    @Inject(IOnsiteRescueResponseRepository)
    private onsiteRescueResponseRepository: IOnsiteRescueResponseRepository,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(IServiceService) private serviceService: IServiceService,
    @Inject(forwardRef(() => IOnsiteRescueRequestService))
    private onsiteRequestService: IOnsiteRescueRequestService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
  ) {}
  async createOnsiteRescueResponse(
    payload: CreateOnsiteRescueResponseDto,
  ): Promise<OnsiteRescueResponseModel> {
    try {
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const onsiteRescueService =
        await this.serviceService.getServiceByCondition({
          name: 'Cứu hộ tại chỗ',
          agent_id: agent.id,
        });
      if (!onsiteRescueService) {
        throw new Error('Agent does not have rescue service');
      }
      const onsiteRescueRequest =
        await this.onsiteRequestService.getOnsiteRescueRequestDetail(
          payload.onsite_rescue_request_id,
        );
      if (!onsiteRescueRequest) {
        throw new Error('Onsite rescue request not found');
      }
      if (onsiteRescueRequest.booking_id && onsiteRescueRequest.agent_id) {
        throw new Error('Onsite rescue request has been booked');
      }
      const currentOnsiteRescueResponse = await this.getOneOnsiteRescueResponseByCondition({
        agent_id: agent.id,
        onsite_rescue_request_id: onsiteRescueRequest.id,
      });
      if (currentOnsiteRescueResponse) {
        throw new Error('Onsite rescue response has already been created');
      }
      const createdOnsiteRescueResponse =
        await this.onsiteRescueResponseRepository.create({
          ...payload,
          service_id: onsiteRescueService.id,
        });
      await this.notificationService.createUserInAppAndPushNotification(
        {
          userId: onsiteRescueRequest.customer.user_id,
          message: `Đại lý ${agent.name} đã chấp nhận yêu cầu cứu hộ của bạn`,
          heading: `Yêu cầu cứu hộ tại chỗ`,
          targetGroup: NotificationSegmentEnum.CUSTOMER,
          data: { onsite_rescue_response_id: createdOnsiteRescueResponse.id, flag: NotificationRescueFlagEnum.ONSITE },
          type: NotificationTypeEnum.AGENT_RESPONSE_RESCUE_REQUEST,
          image: agent.avatar ?? null,
        }
      );
      this.appGateway.server.emit('SEND_ONSITE_RESCUE_RESPONSE', {
        action: 'SEND_ONSITE_RESCUE_RESPONSE',
        data: {
          onsite_rescue_response_id: createdOnsiteRescueResponse.id,
          agent_id: createdOnsiteRescueResponse.agent_id,
        },
        channel: 'CARX_ONSITE_RESCUE',
      });
      return createdOnsiteRescueResponse;
    } catch (error) {
      throw error;
    }
  }

  async getOnsiteRescueResponseList(
    payload: FilterOnsiteRescueResponseDto,
  ): Promise<OnsiteRescueResponseModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const onsiteRescueResponses =
        await this.onsiteRescueResponseRepository.findAllByCondition(
          limit,
          (page - 1) * limit,
          rest,
        );
      return onsiteRescueResponses;
    } catch (error) {
      throw error;
    }
  }

  countOnsiteRescueResponseByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.onsiteRescueResponseRepository.countByCondition(rest);
  }

  getOnsiteRescueResponseDetail(
    id: string,
  ): Promise<OnsiteRescueResponseModel> {
    return this.onsiteRescueResponseRepository.findById(id);
  }

  async updateOnsiteRescueResponse(
    id: string,
    payload: UpdateOnsiteRescueResponseDto,
  ): Promise<OnsiteRescueResponseModel> {
    try {
      const [nModified, onsiteRescueResponses] =
        await this.onsiteRescueResponseRepository.update(id, payload);
      if (!nModified) {
        throw new Error('Cannot update onsite rescue response');
      }
      return onsiteRescueResponses[0];
    } catch (error) {
      throw error;
    }
  }

  async getOneOnsiteRescueResponseByCondition(
    condition: any,
  ): Promise<OnsiteRescueResponseModel> {
    try {
      const onsiteRescueResponse =
        await this.onsiteRescueResponseRepository.findOneByCondition(condition);
      return onsiteRescueResponse;
    } catch (error) {
      throw error;
    }
  }

  async createRejectedOnsiteRescueResponse(
    payload: CreateOnsiteRescueResponseDto,
  ): Promise<OnsiteRescueResponseModel> {
    try {
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const onsiteRescueService =
        await this.serviceService.getServiceByCondition({
          name: 'Cứu hộ tại chỗ',
          agent_id: agent.id,
        });
      if (!onsiteRescueService) {
        throw new Error('Agent does not have rescue service');
      }
      const onSiteRescueRequest =
        await this.onsiteRequestService.getOnsiteRescueRequestDetail(
          payload.onsite_rescue_request_id,
        );
      if (!onSiteRescueRequest) {
        throw new Error('Onsite rescue request not found');
      }
      const createdOnsiteRescueResponse =
        await this.onsiteRescueResponseRepository.create({
          ...payload,
          service_id: onsiteRescueService.id,
          status: OnsiteRescueResponseStatusEnum.CANCELLED,
        });
      this.appGateway.server.emit('REJECT_ONSITE_RESCUE_REQUEST', {
        action: 'REJECT_ONSITE_RESCUE_REQUEST',
        data: {
          onsite_rescue_response_id: createdOnsiteRescueResponse.id,
          agent_id: createdOnsiteRescueResponse.agent_id,
        },
        channel: 'CARX_ONSITE_RESCUE',
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  getOnsiteRescueResponseByConditionWithoutPagination(
    condition: any,
  ): Promise<OnsiteRescueResponseModel[]> {
    try {
      return this.onsiteRescueResponseRepository.findAllByConditionWithoutPagination(
        condition,
      );
    } catch (error) {
      throw error;
    }
  }
}

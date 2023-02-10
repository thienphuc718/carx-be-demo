import { forwardRef, Inject } from '@nestjs/common';
import { AppGateway } from '../../../../gateway/AppGateway';
import { TrailerFormerRescueResponseModel } from '../../../../models';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import {
  NotificationRescueFlagEnum,
  NotificationSegmentEnum,
  NotificationTypeEnum
} from '../../../notifications/enum/NotificationEnum';
import { INotificationService } from '../../../notifications/service/NotificationServiceInterface';
import { IServiceService } from '../../../services/service/ServiceServiceInterface';
import {
  CreateTrailerFormerRescueResponseDto,
  FilterTrailerFormerRescueResponseDto,
  UpdateTrailerFormerRescueResponseDto,
} from '../../dto/TrailerFormerRescueResponseDto';
import { TrailerRescueRequestFormerStatusEnum } from '../../enum/TrailerRescueRequestEnum';
import { TrailerFormerRescueResponseStatusEnum } from '../../enum/TrailerFormerRescueResponseEnum';
import { ITrailerFormerRescueResponseRepository } from '../../repository/trailer-former-rescue-responses/TrailerFormerRescueResponseRepositoryInterface';
import { ITrailerRescueRequestService } from '../trailer-rescue-requests/TrailerRescueRequestServiceInterface';
import { ITrailerFormerRescueResponseService } from './TrailerFormerRescueResponseServiceInterface';

export class TrailerFormerRescueResponseServiceImplementation
  implements ITrailerFormerRescueResponseService
{
  constructor(
    @Inject(ITrailerFormerRescueResponseRepository)
    private trailerFormerRescueResponseRepository: ITrailerFormerRescueResponseRepository,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(IServiceService) private serviceService: IServiceService,
    @Inject(forwardRef(() => ITrailerRescueRequestService))
    private trailerRequestService: ITrailerRescueRequestService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
  ) {}
  async createTrailerFormerRescueResponse(
    payload: CreateTrailerFormerRescueResponseDto,
  ): Promise<TrailerFormerRescueResponseModel> {
    try {
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const trailerRescueService =
        await this.serviceService.getServiceByCondition({
          name: 'Cứu hộ tại garage',
          agent_id: agent.id,
        });
      if (!trailerRescueService) {
        throw new Error('Agent does not have rescue service');
      }
      const trailerRescueRequest =
        await this.trailerRequestService.getTrailerRescueRequestDetail(
          payload.trailer_rescue_request_id,
        );
      if (!trailerRescueRequest) {
        throw new Error('Trailer rescue request not found');
      }
      if (trailerRescueRequest.former_booking_id && trailerRescueRequest.former_agent_id) {
        throw new Error('Trailer rescue request has been booked');
      }
      if (
        trailerRescueRequest.former_status === TrailerRescueRequestFormerStatusEnum.COMPLETED || 
        trailerRescueRequest.former_status === TrailerRescueRequestFormerStatusEnum.CANCELLED
        ) 
      {
        throw new Error('TrailerRescueRequest has been cancelled or completed');
      }
      const currentTrailerFormerRescueResponse = await this.getOneTrailerFormerRescueResponseByCondition({
        agent_id: agent.id,
        trailer_rescue_request_id: trailerRescueRequest.id,
      });
      if (currentTrailerFormerRescueResponse) {
        throw new Error('Trailer rescue response has already been created');
      }
      const createdTrailerFormerRescueResponse =
        await this.trailerFormerRescueResponseRepository.create({
          ...payload,
          service_id: trailerRescueService.id,
        });
      await this.notificationService.createUserInAppAndPushNotification(
        {
          userId: trailerRescueRequest.customer.user_id,
          message: `Đại lý ${agent.name} đã chấp nhập yêu cầu cứu hộ của bạn`,
          heading: `Yêu cầu kéo xe cứu hộ`,
          targetGroup: NotificationSegmentEnum.CUSTOMER,
          data: { trailer_rescue_response_id: createdTrailerFormerRescueResponse.id, flag: NotificationRescueFlagEnum.TRAILER_FORMER },
          type: NotificationTypeEnum.AGENT_RESPONSE_RESCUE_REQUEST,
          image: agent.avatar ?? null,
        }
      );
      this.appGateway.server.emit('SEND_TRAILER_RESCUE_RESPONSE', {
        action: 'SEND_TRAILER_RESCUE_RESPONSE',
        data: {
          trailer_rescue_response_id: createdTrailerFormerRescueResponse.id,
          agent_id: createdTrailerFormerRescueResponse.agent_id,
        },
        channel: 'CARX_TRAILER_RESCUE',
      });
      return createdTrailerFormerRescueResponse;
    } catch (error) {
      throw error;
    }
  }

  async getTrailerFormerRescueResponseList(
    payload: FilterTrailerFormerRescueResponseDto,
  ): Promise<TrailerFormerRescueResponseModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const trailerFormerRescueResponses =
        await this.trailerFormerRescueResponseRepository.findAllByCondition(
          limit,
          (page - 1) * limit,
          rest,
        );
      return trailerFormerRescueResponses;
    } catch (error) {
      throw error;
    }
  }

  countTrailerFormerRescueResponseByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.trailerFormerRescueResponseRepository.countByCondition(rest);
  }

  getTrailerFormerRescueResponseDetail(
    id: string,
  ): Promise<TrailerFormerRescueResponseModel> {
    return this.trailerFormerRescueResponseRepository.findById(id);
  }

  async updateTrailerFormerRescueResponse(
    id: string,
    payload: UpdateTrailerFormerRescueResponseDto,
  ): Promise<TrailerFormerRescueResponseModel> {
    try {
      const [nModified, trailerFormerRescueResponses] =
        await this.trailerFormerRescueResponseRepository.update(id, payload);
      if (!nModified) {
        throw new Error('Cannot update trailer rescue response');
      }
      return trailerFormerRescueResponses[0];
    } catch (error) {
      throw error;
    }
  }

  async getOneTrailerFormerRescueResponseByCondition(
    condition: any,
  ): Promise<TrailerFormerRescueResponseModel> {
    try {
      const trailerFormerRescueResponse =
        await this.trailerFormerRescueResponseRepository.findOneByCondition(condition);
      return trailerFormerRescueResponse;
    } catch (error) {
      throw error;
    }
  }

  async createRejectedTrailerFormerRescueResponse(
    payload: CreateTrailerFormerRescueResponseDto,
  ): Promise<TrailerFormerRescueResponseModel> {
    try {
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const trailerRescueService =
        await this.serviceService.getServiceByCondition({
          name: 'Cứu hộ tại garage',
          agent_id: agent.id,
        });
      if (!trailerRescueService) {
        throw new Error('Agent does not have rescue service');
      }
      const trailerRescueRequest =
        await this.trailerRequestService.getTrailerRescueRequestDetail(
          payload.trailer_rescue_request_id,
        );
      if (!trailerRescueRequest) {
        throw new Error('Trailer rescue request not found');
      }
      const createdTrailerFormerRescueResponse =
        await this.trailerFormerRescueResponseRepository.create({
          ...payload,
          service_id: trailerRescueService.id,
          status: TrailerFormerRescueResponseStatusEnum.REJECTED,
        });
      this.appGateway.server.emit('REJECT_TRAILER_RESCUE_REQUEST', {
        action: 'REJECT_TRAILER_RESCUE_REQUEST',
        data: {
          trailer_rescue_response_id: createdTrailerFormerRescueResponse.id,
          agent_id: createdTrailerFormerRescueResponse.agent_id,
        },
        channel: 'CARX_TRAILER_RESCUE',
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  getTrailerFormerRescueResponseByConditionWithoutPagination(
    condition: any,
  ): Promise<TrailerFormerRescueResponseModel[]> {
    try {
      return this.trailerFormerRescueResponseRepository.findAllByConditionWithoutPagination(
        condition,
      );
    } catch (error) {
      throw error;
    }
  }
}

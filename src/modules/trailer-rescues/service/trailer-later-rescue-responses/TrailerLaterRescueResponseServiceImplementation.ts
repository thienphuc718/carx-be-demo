import {forwardRef, Inject} from '@nestjs/common';
import {AppGateway} from '../../../../gateway/AppGateway';
import {TrailerLaterRescueResponseModel} from '../../../../models';
import {IAgentService} from '../../../agents/service/AgentServiceInterface';
import {
  NotificationRescueFlagEnum,
  NotificationSegmentEnum,
  NotificationTypeEnum
} from '../../../notifications/enum/NotificationEnum';
import {INotificationService} from '../../../notifications/service/NotificationServiceInterface';
import {CurrencyUnitEnum} from '../../../products/enum/ProductEnum';
import {IServiceCategoryService} from '../../../services/service/service-categories/ServiceCategoryServiceInterface';
import {IServiceService} from '../../../services/service/ServiceServiceInterface';
import {
  CreateRejectedTrailerLaterRescueResponseDto,
  CreateTrailerLaterRescueResponseDto,
  FilterTrailerLaterRescueResponseDto,
  UpdateTrailerLaterRescueResponseDto,
} from '../../dto/TrailerLaterRescueResponseDto';
import {TrailerLaterRescueResponseStatusEnum} from '../../enum/TrailerLaterRescueResponseEnum';
import {TrailerRescueRequestLaterStatusEnum} from '../../enum/TrailerRescueRequestEnum';
import {
  ITrailerLaterRescueResponseRepository
} from '../../repository/trailer-later-rescue-responses/TrailerLaterRescueResponseRepositoryInterface';
import {ITrailerRescueRequestService} from '../trailer-rescue-requests/TrailerRescueRequestServiceInterface';
import {ITrailerLaterRescueResponseService} from './TrailerLaterRescueResponseServiceInterface';

export class TrailerLaterRescueResponseServiceImplementation
  implements ITrailerLaterRescueResponseService
{
  constructor(
    @Inject(ITrailerLaterRescueResponseRepository)
    private trailerLaterRescueResponseRepository: ITrailerLaterRescueResponseRepository,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(IServiceService) private serviceService: IServiceService,
    @Inject(forwardRef(() => ITrailerRescueRequestService))
    private trailerRequestService: ITrailerRescueRequestService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(IServiceCategoryService) 
    private serviceCategoryService: IServiceCategoryService,
  ) {}
  async createTrailerLaterRescueResponse(
    payload: CreateTrailerLaterRescueResponseDto,
  ): Promise<TrailerLaterRescueResponseModel> {
    try {
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const trailerRescueService =
        await this.serviceService.getServiceByCondition({
          name: 'Kéo xe cứu hộ',
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
      if (trailerRescueRequest.later_booking_id && trailerRescueRequest.later_agent_id) {
        throw new Error('Trailer rescue request has been booked');
      }
      if (
        trailerRescueRequest.later_status === TrailerRescueRequestLaterStatusEnum.COMPLETED || 
        trailerRescueRequest.later_status === TrailerRescueRequestLaterStatusEnum.CANCELLED
        ) 
      {
        throw new Error('TrailerRescueRequest has been cancelled or completed');
      }
      const currentTrailerLaterRescueResponse = await this.getOneTrailerLaterRescueResponseByCondition({
        agent_id: agent.id,
        trailer_rescue_request_id: trailerRescueRequest.id,
      });
      if (currentTrailerLaterRescueResponse) {
        throw new Error('Trailer rescue response has already been created');
      }
      const rescueServiceCategory = await this.serviceCategoryService.getServiceCategoryByCondition({ name: 'Cứu hộ' });
      if (!rescueServiceCategory) {
        throw new Error('Rescue service category not found');
      }
      const quotationServiceParams = {
        ...payload.trailer_later_rescue_response_service_info,
        name: 'Dịch vụ kéo xe cứu hộ',
        is_guaranteed: false,
        agent_id: agent.id,
        is_rescue_service: true,
        currency_unit: CurrencyUnitEnum.VND,
        category_ids: [rescueServiceCategory.id],
      }
      const createdQuotationService = await this.serviceService.createService(quotationServiceParams, agent.user_id);
      if (!createdQuotationService) {
        throw new Error('Cannot create quotation');
      }
      const createdTrailerLaterRescueResponse =
        await this.trailerLaterRescueResponseRepository.create({
          ...payload,
          service_id: createdQuotationService.id,
        });
      await this.notificationService.createUserInAppAndPushNotification(
        {
          userId: trailerRescueRequest.customer.user_id,
          message: `Đại lý ${agent.name} đã chấp nhận yêu cầu cứu hộ của bạn`,
          heading: `Yêu cầu kéo xe cứu hộ`,
          targetGroup: NotificationSegmentEnum.CUSTOMER,
          data: { trailer_rescue_response_id: createdTrailerLaterRescueResponse.id, flag: NotificationRescueFlagEnum.TRAILER_LATER },
          type: NotificationTypeEnum.AGENT_RESPONSE_RESCUE_REQUEST,
          image: trailerRescueRequest.customer.avatar ?? null,
        }
      );
      this.appGateway.server.emit('SEND_TRAILER_RESCUE_RESPONSE', {
        action: 'SEND_TRAILER_RESCUE_RESPONSE',
        data: {
          trailer_rescue_response_id: createdTrailerLaterRescueResponse.id,
          agent_id: createdTrailerLaterRescueResponse.agent_id,
        },
        channel: 'CARX_TRAILER_RESCUE',
      });
      return createdTrailerLaterRescueResponse;
    } catch (error) {
      throw error;
    }
  }

  async getTrailerLaterRescueResponseList(
    payload: FilterTrailerLaterRescueResponseDto,
  ): Promise<TrailerLaterRescueResponseModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const trailerLaterRescueResponses =
        await this.trailerLaterRescueResponseRepository.findAllByCondition(
          limit,
          (page - 1) * limit,
          rest,
        );
      return trailerLaterRescueResponses;
    } catch (error) {
      throw error;
    }
  }

  countTrailerLaterRescueResponseByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.trailerLaterRescueResponseRepository.countByCondition(rest);
  }

  getTrailerLaterRescueResponseDetail(
    id: string,
  ): Promise<TrailerLaterRescueResponseModel> {
    return this.trailerLaterRescueResponseRepository.findById(id);
  }

  async updateTrailerLaterRescueResponse(
    id: string,
    payload: UpdateTrailerLaterRescueResponseDto,
  ): Promise<TrailerLaterRescueResponseModel> {
    try {
      const [nModified, trailerLaterRescueResponses] =
        await this.trailerLaterRescueResponseRepository.update(id, payload);
      if (!nModified) {
        throw new Error('Cannot update trailer rescue response');
      }
      const trailerLaterRescueResponse = trailerLaterRescueResponses[0];
      return trailerLaterRescueResponse;
    } catch (error) {
      throw error;
    }
  }

  async getOneTrailerLaterRescueResponseByCondition(
    condition: any,
  ): Promise<TrailerLaterRescueResponseModel> {
    try {
      const trailerLaterRescueResponse =
        await this.trailerLaterRescueResponseRepository.findOneByCondition(condition);
      return trailerLaterRescueResponse;
    } catch (error) {
      throw error;
    }
  }

  async createRejectedTrailerLaterRescueResponse(
    payload: CreateRejectedTrailerLaterRescueResponseDto,
  ): Promise<TrailerLaterRescueResponseModel> {
    try {
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const trailerRescueRequest =
        await this.trailerRequestService.getTrailerRescueRequestDetail(
          payload.trailer_rescue_request_id,
        );
      if (!trailerRescueRequest) {
        throw new Error('Trailer rescue request not found');
      }
      if (trailerRescueRequest.later_status === TrailerRescueRequestLaterStatusEnum.COMPLETED) {
        throw new Error('Trailer rescue request has been completed');
      }
      const trailerRescueService =
        await this.serviceService.getServiceByCondition({
          name: 'Dịch vụ kéo xe cứu hộ',
          agent_id: agent.id,
        });
      if (!trailerRescueService) {
        throw new Error('Agent does not have rescue service');
      }
      
      const createdTrailerLaterRescueResponse =
        await this.trailerLaterRescueResponseRepository.create({
          ...payload,
          service_id: trailerRescueService.id,
          status: TrailerLaterRescueResponseStatusEnum.REJECTED,
        });
      this.appGateway.server.emit('REJECT_TRAILER_RESCUE_REQUEST', {
        action: 'REJECT_TRAILER_RESCUE_REQUEST',
        data: {
          trailer_rescue_response_id: createdTrailerLaterRescueResponse.id,
          agent_id: createdTrailerLaterRescueResponse.agent_id,
        },
        channel: 'CARX_TRAILER_RESCUE',
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  getTrailerLaterRescueResponseByConditionWithoutPagination(
    condition: any,
  ): Promise<TrailerLaterRescueResponseModel[]> {
    try {
      return this.trailerLaterRescueResponseRepository.findAllByConditionWithoutPagination(
        condition,
      );
    } catch (error) {
      throw error;
    }
  }
}

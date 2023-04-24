import { forwardRef, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { AppGateway } from '../../../../gateway/AppGateway';
import {
  TrailerRescueRequestModel,
  TrailerFormerRescueResponseModel,
} from '../../../../models';
import { ICustomerService } from '../../../customers/service/customer/CustomerServiceInterface';
import {
  NotificationRescueFlagEnum,
  NotificationSegmentEnum,
  NotificationTypeEnum,
} from '../../../notifications/enum/NotificationEnum';
import { INotificationService } from '../../../notifications/service/NotificationServiceInterface';
import {
  CreateTrailerRescueRequestDto,
  FilterTrailerRescueRequestDto,
  UpdateTrailerRescueRequestDto,
} from '../../dto/TrailerRescueRequestDto';
import {
  TrailerRescueRequestFormerStatusEnum,
  TrailerRescueRequestLaterStatusEnum,
} from '../../enum/TrailerRescueRequestEnum';
import { TrailerFormerRescueResponseStatusEnum } from '../../enum/TrailerFormerRescueResponseEnum';
import { ITrailerRescueRequestRepository } from '../../repository/trailer-rescue-requests/TrailerRescueRequestRepositoryInterface';
import { ITrailerFormerRescueResponseService } from '../trailer-former-rescue-responses/TrailerFormerRescueResponseServiceInterface';
import { ITrailerLaterRescueResponseService } from '../trailer-later-rescue-responses/TrailerLaterRescueResponseServiceInterface';
import { ITrailerRescueRequestService } from './TrailerRescueRequestServiceInterface';
import { TrailerLaterRescueResponseStatusEnum } from '../../enum/TrailerLaterRescueResponseEnum';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { IAgentCategoryService } from '../../../agent-categories/service/AgentCategoryServiceInterface';
import { IBookingService } from "../../../bookings/service/BookingServiceInterface";
import { EventEmitter2 } from "@nestjs/event-emitter";

export class TrailerRescueRequestServiceImplementation
  implements ITrailerRescueRequestService {
  constructor(
    @Inject(ITrailerRescueRequestRepository)
    private trailerRescueRequestRepository: ITrailerRescueRequestRepository,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(forwardRef(() => ITrailerFormerRescueResponseService))
    private trailerFormerRescueResponseService: ITrailerFormerRescueResponseService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(forwardRef(() => ITrailerLaterRescueResponseService))
    private trailerLaterRescueResponseService: ITrailerLaterRescueResponseService,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(IAgentCategoryService)
    private agentCategoryService: IAgentCategoryService,
    @Inject(forwardRef(() => IBookingService)) private bookingService: IBookingService,
    private eventEmitter: EventEmitter2,
  ) { }

  async createTrailerRescueRequest(
    payload: CreateTrailerRescueRequestDto,
  ): Promise<TrailerRescueRequestModel> {
    try {
      const customer = await this.customerService.getCustomerDetail(
        payload.customer_id,
        'public',
      );
      if (!customer) {
        throw new Error('Customer not found');
      }
      const createdTrailerRescueRequest = await this.trailerRescueRequestRepository.getCurrentOfCustomer(customer.id);
      if (createdTrailerRescueRequest) {
        throw new Error('Trailer rescue request has been created');
      }
      const newTrailerRescueRequest =
        await this.trailerRescueRequestRepository.create(payload);
      if (newTrailerRescueRequest) {
        this.eventEmitter.emit('SEND_TRAILER_FORMER_RESCUE_REQUEST_NOTIFICATION', {
          trailerRescueRequestId: newTrailerRescueRequest.id,
          customerInfo: customer.full_name || customer.phone_number,
          image: customer.avatar || null,
          distance: 70,
          longitude: payload.customer_info.current_location_geo.geometry.location.lng,
          latitude: payload.customer_info.current_location_geo.geometry.location.lat
        });
        this.appGateway.server.emit('SEND_TRAILER_RESCUE_REQUEST', {
          action: 'SEND_TRAILER_RESCUE_REQUEST',
          data: {
            trailer_rescue_request_id: newTrailerRescueRequest.id,
          },
          channel: 'CARX_TRAILER_RESCUE',
        });
      } else {
        this.appGateway.server.emit('SEND_TRAILER_RESCUE_REQUEST_FAILED', {
          action: 'SEND_TRAILER_RESCUE_REQUEST',
          data: {
            message: 'Cannot create trailer rescue request'
          },
          channel: 'CARX_TRAILER_RESCUE',
        });
      }
      return newTrailerRescueRequest;
    } catch (error) {
      throw error;
    }
  }
  async getTrailerRescueRequestList(
    payload: FilterTrailerRescueRequestDto,
  ): Promise<
    Array<
      TrailerRescueRequestModel & {
        response?: TrailerFormerRescueResponseModel;
      }
    >
  > {
    try {
      const { limit, page, former_agent_id, later_agent_id, ...rest } = payload;
      let trailerRescueRequests = null;
      if (former_agent_id && later_agent_id) {
        throw new Error(
          'former_agent_id and later_agent_id should not be specified together',
        );
      }
      if (former_agent_id) {
        const rejectedIds = await this.getRejectedTrailerRescueRequestIds({
          former_agent_id: former_agent_id,
        });
        const queryCondition = {
          ...rest,
          id: {
            [Op.notIn]: rejectedIds,
          },
        };
        trailerRescueRequests =
          await this.trailerRescueRequestRepository.findAllByCondition(
            limit,
            (page - 1) * limit,
            queryCondition,
          );
      } else if (later_agent_id) {
        const rejectedIds = await this.getRejectedTrailerRescueRequestIds({
          later_agent_id: later_agent_id,
        });
        const queryCondition = {
          ...rest,
          id: {
            [Op.notIn]: rejectedIds,
          },
        };
        trailerRescueRequests =
          await this.trailerRescueRequestRepository.findAllByCondition(
            limit,
            (page - 1) * limit,
            queryCondition,
          );
      } else {
        trailerRescueRequests =
          await this.trailerRescueRequestRepository.findAllByCondition(
            limit,
            (page - 1) * limit,
            rest,
          );
      }
      return trailerRescueRequests;
    } catch (error) {
      throw error;
    }
  }

  getTrailerRescueRequestDetail(
    id: string,
  ): Promise<TrailerRescueRequestModel> {
    return this.trailerRescueRequestRepository.findById(id);
  }

  getTrailerRescueRequestByCondition(
    condition: any,
  ): Promise<TrailerRescueRequestModel> {
    return this.trailerRescueRequestRepository.findOneByCondition(condition);
  }

  getCurrentTrailerRescueRequest(
    customerId: string,
  ): Promise<TrailerRescueRequestModel> {
    return this.trailerRescueRequestRepository.getCurrentOfCustomer(customerId);
  }
  async updateTrailerRescueRequest(
    id: string,
    payload: UpdateTrailerRescueRequestDto,
  ): Promise<TrailerRescueRequestModel> {
    try {
      const trailerRescueRequest = await this.getTrailerRescueRequestDetail(id);
      if (!trailerRescueRequest) {
        throw new Error('Trailer Rescue Request not found');
      }
      let agent = null;
      if (
        payload.former_agent_id &&
        payload.former_booking_id &&
        payload.former_status ===
        TrailerRescueRequestFormerStatusEnum.PROCESSING
      ) {
        agent = await this.agentService.getAgentDetails(
          payload.former_agent_id,
        );
        if (!agent) {
          throw new Error('Agent not found');
        }
        this.appGateway.server.emit('CUSTOMER_ACCEPT_FORMER_RESCUE_RESPONSE', {
          action: 'CUSTOMER_ACCEPT_TRAILER_FORMER_RESCUE_RESPONSE',
          data: {
            trailer_rescue_request_id: trailerRescueRequest.id,
          },
          channel: 'CARX_TRAILER_RESCUE',
        });
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: agent.user_id,
            message: `Khách hàng ${trailerRescueRequest.customer.full_name ||
              trailerRescueRequest.customer.phone_number
              } đã chọn dịch vụ kéo xe cứu hộ của bạn`,
            heading: `Yêu cầu kéo xe cứu hộ`,
            targetGroup: NotificationSegmentEnum.AGENT,
            data: { trailer_rescue_request_id: trailerRescueRequest.id, flag: NotificationRescueFlagEnum.TRAILER_FORMER },
            type: NotificationTypeEnum.CUSTOMER_ACCEPT_RESCUE_RESPONSE,
            image: trailerRescueRequest.customer.avatar ?? null,
          }
        );
        this.eventEmitter.emit('SEND_TRAILER_LATER_RESCUE_REQUEST_NOTIFICATION', {
          trailerRescueRequestId: trailerRescueRequest.id,
          customerInfo: trailerRescueRequest.customer.full_name || trailerRescueRequest.customer.phone_number,
          image: trailerRescueRequest.customer.avatar ?? null,
        })
      }
      if (
        payload.later_agent_id &&
        payload.later_booking_id &&
        payload.later_status === TrailerRescueRequestLaterStatusEnum.PROCESSING
      ) {
        agent = await this.agentService.getAgentDetails(payload.later_agent_id);
        if (!agent) {
          throw new Error('Agent not found');
        }
        this.appGateway.server.emit('CUSTOMER_ACCEPT_LATER_RESCUE_RESPONSE', {
          action: 'CUSTOMER_ACCEPT_TRAILER_LATER_RESCUE_RESPONSE',
          data: {
            trailer_rescue_request_id: trailerRescueRequest.id,
          },
          channel: 'CARX_TRAILER_RESCUE',
        });
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: agent.user_id,
            message: `Khách hàng ${trailerRescueRequest.customer.full_name ||
              trailerRescueRequest.customer.phone_number
              } đã chọn dịch vụ kéo xe cứu hộ của bạn`,
            heading: `Yêu cầu kéo xe cứu hộ`,
            targetGroup: NotificationSegmentEnum.AGENT,
            data: { trailer_rescue_request_id: trailerRescueRequest.id, flag: NotificationRescueFlagEnum.TRAILER_LATER },
            type: NotificationTypeEnum.AGENT_SEND_QUOTATION,
            image: trailerRescueRequest.customer.avatar ?? null,
          }
        );
      }
      const [nModified, trailerRescueRequests] =
        await this.trailerRescueRequestRepository.update(id, payload);
      if (!nModified) {
        throw new Error('Cannot update trailer rescue request');
      }
      const updatedTrailerRescueRequest = await this.getTrailerRescueRequestDetail(trailerRescueRequests[0].id);
      if (
        payload.former_status &&
        payload.former_status ===
        TrailerRescueRequestFormerStatusEnum.COMPLETED &&
        updatedTrailerRescueRequest.former_status ===
        TrailerRescueRequestFormerStatusEnum.COMPLETED
      ) {
        agent = await this.agentService.getAgentDetails(updatedTrailerRescueRequest.former_agent_id);
        if (!agent) {
          throw new Error('Agent not found');
        }
        this.appGateway.server.emit('AGENT_CONFIRM_FORMER_RESCUE_RESPONSE', {
          action: 'AGENT_CONFIRM_TRAILER_FORMER_RESCUE_RESPONSE',
          data: {
            trailer_rescue_request_id: trailerRescueRequest.id,
          },
          channel: 'CARX_TRAILER_RESCUE',
        });
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: trailerRescueRequest.customer.user_id,
            message: `Dịch vụ yêu cầu cứu hộ của bạn đã được hoàn thành`,
            heading: `Yêu cầu kéo xe cứu hộ`,
            targetGroup: NotificationSegmentEnum.CUSTOMER,
            data: { trailer_rescue_request_id: trailerRescueRequest.id, flag: NotificationRescueFlagEnum.TRAILER_LATER },
            type: NotificationTypeEnum.AGENT_RESPONSE_RESCUE_REQUEST,
            image: agent.avatar ?? null,
          }
        );
        const trailerFormerRescueResponses =
          await this.trailerFormerRescueResponseService.getTrailerFormerRescueResponseByConditionWithoutPagination(
            {
              trailer_rescue_request_id: trailerRescueRequest.id,
            },
          );
        trailerFormerRescueResponses.length && Promise.all(
          trailerFormerRescueResponses.map((formerResponse) =>
            formerResponse.destroy(),
          ),
        );
      } else if (
        payload.later_status &&
        payload.later_status ===
        TrailerRescueRequestLaterStatusEnum.COMPLETED &&
        updatedTrailerRescueRequest.later_status ===
        TrailerRescueRequestLaterStatusEnum.COMPLETED
      ) {
        agent = await this.agentService.getAgentDetails(updatedTrailerRescueRequest.later_agent_id);
        if (!agent) {
          throw new Error('Agent not found');
        }
        this.appGateway.server.emit('AGENT_CONFIRM_FORMER_RESCUE_RESPONSE', {
          action: 'AGENT_CONFIRM_TRAILER_FORMER_RESCUE_RESPONSE',
          data: {
            trailer_rescue_request_id: trailerRescueRequest.id,
          },
          channel: 'CARX_TRAILER_RESCUE',
        });
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: trailerRescueRequest.customer.user_id,
            message: `Đại lý ${agent.name} xác nhận đã hoàn thành yêu cầu kéo xe cứu hộ của bạn`,
            heading: `Yêu cầu kéo xe cứu hộ`,
            targetGroup: NotificationSegmentEnum.CUSTOMER,
            data: { trailer_rescue_request_id: trailerRescueRequest.id },
            type: NotificationTypeEnum.CUSTOMER_ACCEPT_RESCUE_RESPONSE,
            image: agent.avatar ?? null,
          }
        );
        const trailerLaterRescueResponses =
          await this.trailerLaterRescueResponseService.getTrailerLaterRescueResponseByConditionWithoutPagination(
            {
              trailer_rescue_request_id: trailerRescueRequest.id,
            },
          );
        trailerLaterRescueResponses.length && Promise.all(
          trailerLaterRescueResponses.map((laterResponse) =>
            laterResponse.destroy(),
          ),
        );
      }
      if (
        payload.former_status &&
        payload.former_status ===
        TrailerRescueRequestFormerStatusEnum.CANCELLED &&
        updatedTrailerRescueRequest.former_status ===
        TrailerRescueRequestFormerStatusEnum.CANCELLED
      ) {
        updatedTrailerRescueRequest.later_status =
          TrailerRescueRequestLaterStatusEnum.CANCELLED;
        await updatedTrailerRescueRequest.save();
        const trailerFormerRescueResponses =
          await this.trailerFormerRescueResponseService.getTrailerFormerRescueResponseByConditionWithoutPagination(
            {
              trailer_rescue_request_id: trailerRescueRequest.id,
            },
          );
        trailerFormerRescueResponses.length && Promise.all(
          trailerFormerRescueResponses.map((formerResponse) =>
            formerResponse.destroy(),
          ),
        );
        const trailerLaterRescueResponses =
          await this.trailerLaterRescueResponseService.getTrailerLaterRescueResponseByConditionWithoutPagination(
            {
              trailer_rescue_request_id: trailerRescueRequest.id,
            },
          );
        trailerLaterRescueResponses.length && Promise.all(
          trailerLaterRescueResponses.map((laterResponse) =>
            laterResponse.destroy(),
          ),
        );

        // cancel booking
        if (updatedTrailerRescueRequest.former_booking_id) {
          let booking = await this.bookingService.getBookingDetail(updatedTrailerRescueRequest.former_booking_id);
          const cancelReason = 'Huỷ yêu cầu kéo xe cứu hộ';
          booking && await this.bookingService.cancelBooking(booking.id, cancelReason, updatedTrailerRescueRequest.customer.user_id);
          if (updatedTrailerRescueRequest.later_booking_id) {
            booking = await this.bookingService.getBookingDetail(updatedTrailerRescueRequest.later_booking_id);
            booking && await this.bookingService.cancelBooking(booking.id, cancelReason, updatedTrailerRescueRequest.customer.user_id);
          }
        }
      }
      return this.getTrailerRescueRequestDetail(updatedTrailerRescueRequest.id);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  async countTrailerRescueRequestByCondition(condition: any): Promise<number> {
    const { limit, page, former_agent_id, later_agent_id, ...rest } = condition;
    if (former_agent_id && later_agent_id) {
      throw new Error(
        'former_agent_id and later_agent_id should not be specified together',
      );
    }
    if (former_agent_id) {
      const rejectedRequestIds = await this.getRejectedTrailerRescueRequestIds({
        former_agent_id: former_agent_id,
      });
      return this.trailerRescueRequestRepository.countByCondition({
        ...rest,
        id: {
          [Op.notIn]: rejectedRequestIds,
        },
      });
    } else if (later_agent_id) {
      const rejectedRequestIds = await this.getRejectedTrailerRescueRequestIds({
        later_agent_id: later_agent_id,
      });
      return this.trailerRescueRequestRepository.countByCondition({
        ...rest,
        id: {
          [Op.notIn]: rejectedRequestIds,
        },
      });
    } else {
      return this.trailerRescueRequestRepository.countByCondition(rest);
    }
  }

  private async getRejectedTrailerRescueRequestIds(
    condition: any,
  ): Promise<string[]> {
    try {
      let result: string[] = [];
      const { former_agent_id, later_agent_id } = condition;
      if (former_agent_id) {
        const agentRejectedResponse =
          await this.trailerFormerRescueResponseService.getTrailerFormerRescueResponseByConditionWithoutPagination(
            {
              agent_id: former_agent_id,
              status: TrailerFormerRescueResponseStatusEnum.REJECTED,
            },
          );
        const rejectedRequestIds = agentRejectedResponse.map(
          (response) => response.trailer_rescue_request_id,
        );
        result = rejectedRequestIds;
      } else {
        const agentRejectedResponse =
          await this.trailerLaterRescueResponseService.getTrailerLaterRescueResponseByConditionWithoutPagination(
            {
              agent_id: later_agent_id,
              status: TrailerLaterRescueResponseStatusEnum.REJECTED,
            },
          );
        const rejectedRequestIds = agentRejectedResponse.map(
          (response) => response.trailer_rescue_request_id,
        );
        result = rejectedRequestIds;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNotYetResponseTrailerRescueRequestByAgentId(
    agent_id: string,
  ): Promise<number> {
    try {
      const agent = await this.agentService.getAgentDetails(agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const agentCategory =
        await this.agentCategoryService.getAgentCategoryDetail(
          agent.category_id,
        );
      if (!agentCategory) {
        throw new Error('Agent category not found');
      }
      let nRequests = 0;
      let nResponses = 0;
      if (agentCategory.name === 'Cứu hộ') {
        nRequests += await this.trailerRescueRequestRepository.countByCondition({
          later_status: TrailerRescueRequestLaterStatusEnum.SENT,
          later_booking_id: null,
          later_agent_id: null,
        });
        nResponses += await this.trailerLaterRescueResponseService.countTrailerLaterRescueResponseByCondition({
          agent_id: agent.id
        })
      } else {
        nRequests += await this.trailerRescueRequestRepository.countByCondition({
          former_status: TrailerRescueRequestFormerStatusEnum.SENT,
          former_agent_id: null,
          former_booking_id: null,
        });
        nResponses += await this.trailerFormerRescueResponseService.countTrailerFormerRescueResponseByCondition({
          agent_id: agent.id,
        });
      }
      return nRequests < nResponses ? 0 : nRequests - nResponses;
    } catch (error) {
      throw error;
    }
  }
}

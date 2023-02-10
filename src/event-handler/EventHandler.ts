import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IProductService } from '../modules/products/service/products/ProductServiceInterface';
import { IServiceService } from '../modules/services/service/ServiceServiceInterface';
import { IAgentService } from "../modules/agents/service/AgentServiceInterface";
import { INotificationService } from "../modules/notifications/service/NotificationServiceInterface";
import { IPushNotificationService } from "../modules/push-notifications/service/PushNotificationInterface";
import {
  NotificationRescueFlagEnum,
  NotificationSegmentEnum,
  NotificationTypeEnum
} from "../modules/notifications/enum/NotificationEnum";

export class EventHandler {
  constructor(
    @Inject(IProductService)
    private productService: IProductService,
    @Inject(IServiceService)
    private serviceService: IServiceService,
    @Inject(IAgentService)
    private agentService: IAgentService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(IPushNotificationService)
    private pushNotificationService: IPushNotificationService,
  ) {}

  @OnEvent('EVENT_PRODUCT_BULK_IMPORT')
  async handleBulkImportProducts(payload: any) {
    if (payload.file && payload.user_id) {
      const data = await this.productService.bulkUpload(payload.file, payload.user_id);
    }
  }

  @OnEvent('EVENT_SERVICE_BULK_IMPORT')
  async handleBulkImportServices(payload: any) {
    if (payload.file && payload.user_id) {
      const data = await this.serviceService.bulkUpload(payload.file, payload.user_id);
    }
  }

  @OnEvent('SEND_TRAILER_FORMER_RESCUE_REQUEST_NOTIFICATION')
  async sendTrailerFormerRescueRequest(payload: { trailerRescueRequestId: string, customerInfo: string, image?: string }) {
    const {trailerRescueRequestId, customerInfo, image} = payload;
    const rescueServices = await this.serviceService.getServiceListByConditionWithoutPagination({
      is_deleted: false,
      name: 'Cứu hộ tại garage',
      is_rescue_service: true,
      agent_category_id: '5530a10b-ffb8-43be-bb90-1d09c293cace',
    });
    let agentIds = rescueServices.map(service => service.agent_id);
    const agents = await this.agentService.getAgentListWithoutPaging({
      is_hidden: false,
      id: agentIds
    });
    let userIds = agents.map(item => item.user_id);
    if (userIds.length) {
      for (const id of userIds) {
        await this.notificationService.createUserInAppAndPushNotification({
          heading: `Yêu cầu kéo xe cứu hộ`,
          message: `Khách hàng ${customerInfo} đã gửi yêu cầu cứu hộ`,
          data: {
            trailer_rescue_request_id: trailerRescueRequestId,
            flag: NotificationRescueFlagEnum.TRAILER_FORMER
          },
          type: NotificationTypeEnum.CUSTOMER_CREATE_RESCUE_REQUEST,
          targetGroup: NotificationSegmentEnum.AGENT,
          userId: id,
          image: image
        });
      }
    }
  }

  @OnEvent('SEND_TRAILER_LATER_RESCUE_REQUEST_NOTIFICATION')
  async sendTrailerLaterRescueRequest(payload: { trailerRescueRequestId: string, customerInfo: string, image?: string }) {
    const { trailerRescueRequestId, customerInfo, image } = payload;
    const rescueServices = await this.serviceService.getServiceListByConditionWithoutPagination({
      is_deleted: false,
      name: 'Dịch vụ kéo xe cứu hộ',
      is_rescue_service: true,
    });
    let agentIds = rescueServices.map(service => service.agent_id);
    const agents = await this.agentService.getAgentListWithoutPaging({
      is_hidden: false,
      id: agentIds
    });
    let userIds = agents.map(item => item.user_id);

    if (userIds.length) {
      for (let id of userIds) {
        await this.notificationService.createUserInAppAndPushNotification({
          message: `Khách hàng ${customerInfo} đã gửi yêu cầu kéo xe cứu hộ`,
          data: {
            trailer_rescue_request_id: trailerRescueRequestId,
            flag: NotificationRescueFlagEnum.TRAILER_LATER
          },
          type: NotificationTypeEnum.CUSTOMER_CREATE_RESCUE_REQUEST,
          targetGroup: NotificationSegmentEnum.AGENT,
          userId: id,
          heading: `Yêu cầu kéo xe cứu hộ`,
          image: image,
        });
      }
    }
  }

  @OnEvent('SEND_ONSITE_RESCUE_REQUEST_NOTIFICATION')
  async sendOnsiteRescueRequestNotification(payload: { onsiteRescueRequestId: string, customerInfo: string, image?: string }) {
    const { onsiteRescueRequestId, customerInfo, image } = payload;
    const onsiteRescueService =
      await this.serviceService.getServiceListByConditionWithoutPagination({
        name: 'Cứu hộ tại chỗ',
        is_deleted: false,
        is_rescue_service: true,
      });
    let agentIds = onsiteRescueService.map(service => service.agent_id);
    const agents = await this.agentService.getAgentListWithoutPaging({
      is_hidden: false,
      id: agentIds,
      is_deleted: false,
    });
    let userIds = agents.map(item => item.user_id);
    if (userIds.length) {
      for (const id of userIds) {
        await this.notificationService.createUserInAppAndPushNotification({
          message: `Khách hàng ${customerInfo} đã gửi yêu cầu cứu hộ tại chỗ`,
          data: {
            onsite_rescue_request_id: onsiteRescueRequestId,
            flag: NotificationRescueFlagEnum.ONSITE,
          },
          type: NotificationTypeEnum.CUSTOMER_CREATE_RESCUE_REQUEST,
          targetGroup: NotificationSegmentEnum.AGENT,
          userId: id,
          heading: `Yêu cầu cứu hộ tại chỗ`,
          image: image,
        });
      }
    }
  }
}


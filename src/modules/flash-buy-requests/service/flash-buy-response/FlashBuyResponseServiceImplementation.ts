import { forwardRef, Inject } from '@nestjs/common';
import { FlashBuyResponseModel } from '../../../../models';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { ProductTypeEnum } from '../../../products/enum/ProductEnum';
import { IProductService } from '../../../products/service/products/ProductServiceInterface';
import {
  CreateFlashBuyResponseDto,
  CreateRejectedFlashBuyResponse,
  FilterFlashBuyResponseDto,
} from '../../dto/FlashBuyResponseDto';
import { IFlashBuyResponseRepository } from '../../repository/flash-buy-response/FlashBuyResponseRepositoryInterface';
import { IFlashBuyRequestService } from '../flash-buy-request/FlashBuyRequestServiceInterface';
import { IFlashBuyResponseService } from './FlashBuyResponseServiceInterface';
import { AppGateway } from '../../../../gateway/AppGateway';
import {
  FlashBuyActionEnum,
  FlashBuyResponseStatusEnum,
} from '../../enum/FlashBuyResponseEnum';
import { INotificationService } from '../../../notifications/service/NotificationServiceInterface';
import { NotificationSegmentEnum, NotificationTypeEnum } from '../../../notifications/enum/NotificationEnum';
import { IPushNotificationService } from '../../../push-notifications/service/PushNotificationInterface';

export class FlashBuyResponseServiceImplementation
  implements IFlashBuyResponseService
{
  constructor(
    @Inject(IFlashBuyResponseRepository)
    private flashBuyResponseRepository: IFlashBuyResponseRepository,
    @Inject(forwardRef(() => IAgentService))
    private agentService: IAgentService,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(IProductService) private productService: IProductService,
    @Inject(forwardRef(() => IFlashBuyRequestService))
    private flashBuyRequestService: IFlashBuyRequestService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(IPushNotificationService)
    private pushNotificationService: IPushNotificationService
  ) {}

  async getFlashBuyResponseList(
    payload: FilterFlashBuyResponseDto,
  ): Promise<FlashBuyResponseModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const data =
        await this.flashBuyResponseRepository.findAllWithCondition(
          limit,
          (page - 1) * limit,
          rest,
        );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createFlashBuyResponse(
    payload: CreateFlashBuyResponseDto,
    userId: string,
  ): Promise<FlashBuyResponseModel> {
    try {
      const { agent_id, flash_buy_request_id, flash_buy_product_info } =
        payload;
      const flashBuyRequest =
        await this.flashBuyRequestService.getFlashBuyRequestDetail(
          flash_buy_request_id,
        );
      if (!flashBuyRequest) {
        throw new Error('Flash buy request has not been initiated');
      }
      if (flashBuyRequest.is_done === true) {
        throw new Error('Flash buy request is already completed');
      }
      const agent = await this.agentService.getAgentDetails(agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const currentFlashBuyResponse = await this.getFlashBuyResponseListByCondition({
        flash_buy_request_id: flashBuyRequest.id,
        agent_id: agent.id,
      });
      if (currentFlashBuyResponse.length > 0) {
        throw new Error('Flash Buy response has already been created');
      }
      const createdProduct = await this.productService.createProduct(
        {
          ...flash_buy_product_info,
          type: ProductTypeEnum.PHYSICAL,
          is_flash_buy: true,
        },
        userId,
      );
      const params = {
        flash_buy_request_id: flashBuyRequest.id,
        agent_id: agent.id,
        product_id: createdProduct.id,
      };
      const createdRecord =
        await this.flashBuyResponseRepository.create(params);

      // SEND NOTIFICATION
      await this.notificationService.createUserInAppAndPushNotification(
        {
          userId: flashBuyRequest.customer.user_id,
          message: `Đại lý ${agent.name} đã gửi báo giá cho flash buy của bạn`,
          heading: `Yêu cầu Flash Buy`,
          targetGroup: NotificationSegmentEnum.CUSTOMER,
          data: { flash_buy_response_id: createdRecord.id || '', flash_buy_request_id: flashBuyRequest.id },
          type: NotificationTypeEnum.AGENT_RESPONSE_FLASH_BUY_REQUEST,
          image: agent.avatar ?? null,
        }
      );

      // EMIT SOCKET EVENT
      this.appGateway.server.emit(`ROOM_${flashBuyRequest.customer_id}`, {
        action: FlashBuyActionEnum.CREATE_FLASH_BUY_RESPONSE,
        data: {
          flash_buy_request_id: flashBuyRequest.id,
        },
        channel: 'CARX_FLASH_BUYS',
      });
      return createdRecord;
    } catch (error) {
      throw error;
    }
  }

  async createRejectedFlashBuyResponse(
    payload: CreateRejectedFlashBuyResponse,
  ): Promise<FlashBuyResponseModel> {
    try {
      const { agent_id, flash_buy_request_id } = payload;
      const flashBuyRequest =
        await this.flashBuyRequestService.getFlashBuyRequestDetail(
          flash_buy_request_id,
        );
      if (!flashBuyRequest) {
        throw new Error('Flash buy request has not been initiated');
      }
      const agent = await this.agentService.getAgentDetails(agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const params = {
        flash_buy_request_id: flashBuyRequest.id,
        agent_id: agent.id,
        status: FlashBuyResponseStatusEnum.REJECTED,
      };
      const createdRecord =
        await this.flashBuyResponseRepository.create(params);
      return createdRecord;
    } catch (error) {
      throw error;
    }
  }

  countFlashBuyResponseByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.flashBuyResponseRepository.count(rest);
  }

  getFlashBuyResponseListByCondition(
    condition: any,
  ): Promise<FlashBuyResponseModel[]> {
    try {
      return this.flashBuyResponseRepository.findAllByConditionWithoutPagination(
        condition,
      );
    } catch (error) {
      throw error;
    }
  }
}

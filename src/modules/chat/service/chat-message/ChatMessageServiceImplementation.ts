import { Inject, forwardRef } from '@nestjs/common';
import { AppGateway } from '../../../../gateway/AppGateway';
import { ChatMessageModel } from '../../../../models';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { ICustomerService } from '../../../customers/service/customer/CustomerServiceInterface';
import {
  NotificationSegmentEnum,
  NotificationTypeEnum,
} from '../../../notifications/enum/NotificationEnum';
import { INotificationService } from '../../../notifications/service/NotificationServiceInterface';
import {
  FilterChatMessageDto,
  CreateChatMessageDto,
} from '../../dto/ChatMessagesDto';
import { IChatMessageRepository } from '../../repository/chat-message/ChatMessageRepositoryInterface';
import { IChatConversationService } from '../chat-conversation/ChatConversationServiceInterface';
import { IChatMessageService } from './ChatMessageServiceInterface';
import { IForbiddenKeywordService } from '../../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import { ChatMessageTypeEnum } from '../../enum/ChatEnum';

export class ChatMessageServiceImplementation implements IChatMessageService {
  constructor(
    @Inject(IChatMessageRepository)
    private chatMessageRepository: IChatMessageRepository,
    @Inject(IChatConversationService)
    private conversationService: IChatConversationService,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(forwardRef(() => IForbiddenKeywordService))
    private forbiddenKeywordService: IForbiddenKeywordService,
  ) {}

  async getAllChatMessages(
    payload: FilterChatMessageDto,
  ): Promise<ChatMessageModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const messages = await this.chatMessageRepository.findAll(
        limit,
        (page - 1) * limit,
        rest,
      );
      return messages;
    } catch (error) {
      throw error;
    }
  }

  async createChatMessage(
    payload: CreateChatMessageDto,
  ): Promise<ChatMessageModel> {
    try {
      const conversation =
        await this.conversationService.getChatConversationDetail(
          payload.conversation_id,
        );
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      const checkForbiddenKeyword =
        await this.forbiddenKeywordService.checkKeywordExist(
          payload.message ? payload.message.content : '',
        );
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR',
        };
        throw data;
      }
      let sender = null;
      let receiver = null;
      let agent = await this.agentService.getAgentDetails(
          payload.receiver_id,
      );
      if (agent) {
        const c1 = await this.customerService.getCustomerDetail(
            payload.sender_id,
            'public',
        );
        sender = c1;
        receiver = agent
      } else {
        const c2 = await this.customerService.getCustomerDetail(
            payload.receiver_id,
            'public',
        );
        agent = await this.agentService.getAgentDetails(
            payload.sender_id,
        );
        receiver = c2
        sender = agent
      }

      if (!sender && !receiver) {
        throw new Error('Agent or Customer not found');
      }
      const createdMessage = await this.chatMessageRepository.create(payload);
      conversation.updated_at = new Date();
      await conversation.save();
      // SEND NOTIFICATION
      const segment = (receiver === agent)
        ? NotificationSegmentEnum.AGENT
        : NotificationSegmentEnum.CUSTOMER;
      let userNameOrPhoneNumber = '';
      if (segment === NotificationSegmentEnum.AGENT) {
        userNameOrPhoneNumber = sender.full_name || sender.phone_number;
      } else {
        userNameOrPhoneNumber = sender.name;
      }
      await this.notificationService.createUserInAppAndPushNotification(
        {
          userId: receiver.user_id,
          message: payload.message.type === ChatMessageTypeEnum.TEXT
            ? createdMessage.message.content
            : `Đã gửi một hình ảnh`,
          heading: userNameOrPhoneNumber,
          targetGroup: segment,
          data: {
            conversation_id: conversation.id,
            message_id: createdMessage.id,
          },
          type: NotificationTypeEnum.NEW_MESSAGE,
          image: receiver.avatar ?? null,
        }
      );

      // EMIT SOCKET EVENT
      const roomName = createdMessage.conversation_id;
      this.appGateway.server.socketsJoin(roomName);
      this.appGateway.server
        .to(roomName)
        .emit(`ROOM_${createdMessage.receiver_id}`, {
          action: 'CREATE_MESSAGE',
          data: {
            sender_id: createdMessage.sender_id,
            conversation_id: createdMessage.conversation_id,
            message_id: createdMessage.id,
            message: createdMessage.message,
            timestamp: createdMessage.created_at,
          },
          channel: 'CARX_MESSAGES',
        });
      return createdMessage;
    } catch (error) {
      throw error;
    }
  }

  countChatMessagesByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.chatMessageRepository.count(queryCondition);
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

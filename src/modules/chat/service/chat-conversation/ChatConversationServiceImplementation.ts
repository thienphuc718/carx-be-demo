import { Inject } from '@nestjs/common';
import { ChatConversationModel } from '../../../../models';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { ICustomerService } from '../../../customers/service/customer/CustomerServiceInterface';
import {
  CreateChatConversationDto,
  FilterChatConversationDto,
} from '../../dto/ChatConversationDto';
import { IChatConversationRepository } from '../../repository/chat-conversation/ChatConversationRepositoryInterface';
import { IChatConversationService } from './ChatConversationServiceInterface';

export class ChatConversationServiceImplementation
  implements IChatConversationService
{
  constructor(
    @Inject(IChatConversationRepository)
    private chatConversationRepository: IChatConversationRepository,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(ICustomerService) private customerService: ICustomerService,
  ) {}

  getChatConversationDetail(id: string): Promise<ChatConversationModel> {
    return this.chatConversationRepository.findById(id);
  }
  async createChatConversation(
    payload: CreateChatConversationDto,
  ): Promise<ChatConversationModel> {
    try {
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      const customer = await this.customerService.getCustomerDetail(
        payload.customer_id,
        'public',
      );
      if (!agent) {
        throw new Error('Agent not found');
      }
      if (!customer) {
        throw new Error('Customer not found');
      }
      const createdConversation = await this.chatConversationRepository.create(
        payload,
      );
      return createdConversation;
    } catch (error) {
      throw error;
    }
  }

  async getAllChatConversationList(
    condition: FilterChatConversationDto,
  ): Promise<ChatConversationModel[]> {
    try {
      const { limit, page, ...rest } = condition;
      const conversations = await this.chatConversationRepository.findAll(
        limit,
        (page - 1) * limit,
        rest,
      );
      return conversations;
    } catch (error) {
      throw error;
    }
  }

  countChatConversationByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.chatConversationRepository.count(queryCondition);
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

import { ChatConversationModel } from '../../../../models';
import {
  CreateChatConversationDto,
  FilterChatConversationDto,
} from '../../dto/ChatConversationDto';

export interface IChatConversationService {
  getAllChatConversationList(
    condition: FilterChatConversationDto,
  ): Promise<ChatConversationModel[]>;
  getChatConversationDetail(id: string): Promise<ChatConversationModel>;
  createChatConversation(
    payload: CreateChatConversationDto,
  ): Promise<ChatConversationModel>;
  countChatConversationByCondition(condition: any): Promise<number>
}

export const IChatConversationService = Symbol('IChatConversationService');

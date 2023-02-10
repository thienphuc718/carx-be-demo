import { ChatMessageModel } from "../../../../models";
import { CreateChatMessageDto, FilterChatMessageDto } from "../../dto/ChatMessagesDto";

export interface IChatMessageService {
    getAllChatMessages(payload: FilterChatMessageDto): Promise<ChatMessageModel[]>
    createChatMessage(payload: CreateChatMessageDto): Promise<ChatMessageModel>
    countChatMessagesByCondition(condition: any): Promise<number>
}

export const IChatMessageService = Symbol('IChatMessageService');
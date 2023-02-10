import { ChatConversationModel } from '../../../../models';

export interface IChatConversationRepository {
  findAll(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ChatConversationModel[]>;
  findById(id: string): Promise<ChatConversationModel>;
  create(payload: any): Promise<ChatConversationModel>;
  count(condition: any): Promise<number>;
}

export const IChatConversationRepository = Symbol(
  'IChatConversationRepository',
);

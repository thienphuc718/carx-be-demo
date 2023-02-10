import { ChatMessageModel } from '../../../../models';

export interface IChatMessageRepository {
  findAll(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ChatMessageModel[]>;
  findById(id: string): Promise<ChatMessageModel>;
  create(payload: any): Promise<ChatMessageModel>;
  count(condition: any): Promise<number>;
}

export const IChatMessageRepository = Symbol('IChatMessageRepository');

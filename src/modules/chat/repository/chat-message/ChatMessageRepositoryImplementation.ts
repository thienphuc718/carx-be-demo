import { InjectModel } from '@nestjs/sequelize';
import { ChatMessageModel } from '../../../../models';
import { IChatMessageRepository } from './ChatMessageRepositoryInterface';

export class ChatMessageRepositoryImplementation
  implements IChatMessageRepository
{
  constructor(
    @InjectModel(ChatMessageModel)
    private chatMessageModel: typeof ChatMessageModel,
  ) {}
  findAll(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ChatMessageModel[]> {
    return this.chatMessageModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['updated_at', 'desc']],
    });
  }

  findById(id: string): Promise<ChatMessageModel> {
    return this.chatMessageModel.findByPk(id, {});
  }

  create(payload: any): Promise<ChatMessageModel> {
    return this.chatMessageModel.create(payload);
  }

  count(condition: any): Promise<number> {
    return this.chatMessageModel.count({
      where: {
        ...condition,
      },
    });
  }
}

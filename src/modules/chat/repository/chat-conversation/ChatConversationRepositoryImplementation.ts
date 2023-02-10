import { InjectModel } from '@nestjs/sequelize';
import {
  AgentModel,
  ChatConversationModel,
  ChatMessageModel,
  CustomerModel,
} from '../../../../models';
import { IChatConversationRepository } from './ChatConversationRepositoryInterface';

export class ChatConversationRepositoryImplementation
  implements IChatConversationRepository
{
  constructor(
    @InjectModel(ChatConversationModel)
    private chatConversationModel: typeof ChatConversationModel,
  ) {}
  findAll(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ChatConversationModel[]> {
    return this.chatConversationModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ChatMessageModel,
          as: 'messages',
          required: false,
          attributes: {
            exclude: ['conversation_id'],
          },
          order: [['updated_at', 'desc']],
        },
        {
          model: AgentModel,
          as: 'agent',
          required: false,
          attributes: {
            exclude: [
              'images',
              'description',
              'payment_method',
              'count_review',
              'rating_points',
              'top_agent',
              'tags',
              'top_agent',
              'created_at',
              'updated_at',
            ],
          },
        },
        {
          model: CustomerModel,
          as: 'customer',
          required: false,
          attributes: {
            exclude: [
              'birthday',
              'note',
              'country_code',
              'city_id',
              'district_id',
              'customer_club_id',
              'tags',
              'point',
              'is_deleted',
              'created_at',
              'updated_at',
            ],
          },
        },
      ],
      order: [
        ['messages', 'updated_at', 'desc'],
        ['updated_at', 'desc'],
      ],
    });
  }
  findById(id: string): Promise<ChatConversationModel> {
    return this.chatConversationModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: ChatMessageModel,
          as: 'messages',
          required: false,
          attributes: {
            exclude: ['conversation_id'],
          },
          order: [['updated_at', 'desc']]
        },
        {
          model: AgentModel,
          as: 'agent',
          required: false,
          attributes: {
            exclude: [
              'images',
              'description',
              'payment_method',
              'count_review',
              'rating_points',
              'top_agent',
              'tags',
              'top_agent',
              'created_at',
              'updated_at',
            ],
          },
        },
        {
          model: CustomerModel,
          as: 'customer',
          required: false,
          attributes: {
            exclude: [
              'birthday',
              'note',
              'country_code',
              'city_id',
              'district_id',
              'customer_club_id',
              'tags',
              'point',
              'is_deleted',
              'created_at',
              'updated_at',
            ],
          },
        },
      ],
      order: [
        ['updated_at', 'desc'],
        ['messages', 'updated_at', 'desc']
      ],
    });
  }
  create(payload: any): Promise<ChatConversationModel> {
    return this.chatConversationModel.create(payload);
  }

  count(condition: any): Promise<number> {
    return this.chatConversationModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
}

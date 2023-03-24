import { InjectModel } from '@nestjs/sequelize';
import {
  AgentModel,
  ChatConversationModel,
  ChatMessageModel,
  CustomerModel,
} from '../../../../models';
import { IChatConversationRepository } from './ChatConversationRepositoryInterface';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export class ChatConversationRepositoryImplementation
  implements IChatConversationRepository
{
  constructor(
    @InjectModel(ChatConversationModel)
    private chatConversationModel: typeof ChatConversationModel,
    private sequelize: Sequelize,
  ) {}
  findAll(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ChatConversationModel[]> {
    condition['is_deleted'] = false;
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
          required: true,
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
              'converted_name',
              'tsv_converted_name'
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
              'converted_full_name',
              'tsv_converted_full_name'
            ],
          },
        },
      ],
      attributes: {
        include: [
          [
            this.sequelize.literal(`(
              select count(*) 
              from "chat_messages" 
              where "chat_messages"."conversation_id" = "chat_conversations"."id" 
            )`),
            'number_of_messages'
          ],
        ]
      },
      order: [
        [{ model: ChatMessageModel, as: 'messages'}, 'updated_at', 'desc'],
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
              'converted_name',
              'tsv_converted_name',
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
              'converted_full_name',
              'tsv_converted_full_name',
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
      include: [
        {
          model: ChatMessageModel,
          as: 'messages',
          required: true,
        },
      ]
    });
  }
}

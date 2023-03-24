import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { AgentModel, CustomerModel } from '.';
import { ChatMessageModel } from './ChatMessages';

@Table({
  modelName: 'chat_conversations',
})
export class ChatConversationModel extends Model<ChatConversationModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  agent_id: string;

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasMany(() => ChatMessageModel)
  messages: ChatMessageModel[];

  @BelongsTo(() => AgentModel, 'agent_id')
  agent: AgentModel;

  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  transformToResponse() {
    const conversation = JSON.parse(JSON.stringify(this));
    const {
      messages = [],
      agent,
      customer,
      ...conversationDetail
    } = conversation;
    const data = {
      ...conversationDetail,
      last_message: messages[0],
      agent,
      customer,
    };
    if (data['number_of_messages']) {
      data['number_of_messages'] = Number(data['number_of_messages']);
    }
    return data;
  }
}

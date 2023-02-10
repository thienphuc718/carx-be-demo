import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ChatConversationModel } from './ChatConversations';

@Table({
  modelName: 'chat_messages',
})
export class ChatMessageModel extends Model<ChatMessageModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  sender_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  receiver_id: string;

  @ForeignKey(() => ChatConversationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  conversation_id: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  message: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ChatConversationModel, 'conversation_id')
  conversation: ChatConversationModel;
}

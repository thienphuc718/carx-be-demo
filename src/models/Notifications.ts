import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from '.';
import { NotificationSegmentEnum, NotificationSendingTypeEnum, NotificationTypeEnum } from '../modules/notifications/enum/NotificationEnum';

@Table({
  modelName: 'notifications',
})
export class NotificationModel extends Model<NotificationModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.JSONB,
  })
  data: Record<string, any>;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.TEXT,
  })
  message: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_read: boolean;

  @Column({
    type: DataType.ENUM(
      'CARX',
      'AGENT_CONFIRM_ORDER',
      'AGENT_CANCEL_ORDER',
      'AGENT_CONFIRM_BOOKING',
      'AGENT_CANCEL_BOOKING',
      'AGENT_RESPONSE_FLASH_BUY_REQUEST',
      'AGENT_RESPONSE_RESCUE_REQUEST',
      'AGENT_SEND_QUOTATION',
      'ORDER_DELIVERING',
      'ORDER_COMPLETED',
      'BOOKING_COMPLETED',
      'BOOKING_WAITING_FOR_PAYMENT',
      'CUSTOMER_CREATE_ORDER',
      'CUSTOMER_CANCEL_ORDER',
      'CUSTOMER_CREATE_BOOKING',
      'CUSTOMER_CANCEL_BOOKING',
      'CUSTOMER_CREATE_FLASH_BUY_REQUEST',
      'CUSTOMER_CREATE_RESCUE_REQUEST',
      'CUSTOMER_ACCEPT_FLASH_BUY_RESPONSE',
      'CUSTOMER_REPORT_ORDER',
      'CUSTOMER_REPORT_BOOKING',
      'CUSTOMER_CONFIRM_QUOTATION',
      'CUSTOMER_REVIEW_ORDER',
      'CUSTOMER_REVIEW_BOOKING',
      'CUSTOMER_ACCEPT_RESCUE_RESPONSE',
      'NEW_MESSAGE',
      'USER_LIKE_POST',
      'USER_COMMENT_POST',
      'UPCOMING_BOOKING',
      'INSURANCE_CONTRACT_CREATED',
      'INSURANCE_CONTRACT_CREATION_FAILED',
      'PAYMENT_FAILED',
    ),
    defaultValue: 'CARX',
  })
  type: NotificationTypeEnum;

  @ForeignKey(() => UserModel)
  @Column
  user_id: string;

  @Column({
    type: DataType.STRING
  })
  target_group: NotificationSegmentEnum;

  @Column({
    type: DataType.STRING
  })
  set_day: string;

  @Column({
    type: DataType.STRING
  })
  set_time: string;

  @Column({
    type: DataType.STRING,
    defaultValue: NotificationSendingTypeEnum.INSTANTLY,
  })
  sending_type: string;

  @BelongsTo(() => UserModel)
  to_user: UserModel;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.STRING,
  })
  push_title: string;

  @Column({
    type: DataType.STRING,
  })
  push_message: string;

  @Column({
    type: DataType.TEXT,
  })
  content: string;

  @Column({
    type: DataType.JSONB,
  })
  vendor_response: Record<string, any>;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  transformToResponse() {
    try {
      let data = JSON.parse(JSON.stringify(this));
      return data;
    } catch (error) {
      throw error;
    }
  }
}

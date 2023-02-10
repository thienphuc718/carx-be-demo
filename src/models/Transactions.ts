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
import { AgentModel, CustomerModel } from '.';
import { TransactionStatusEnum } from '../modules/transactions/enum/TransactionEnum';
import { OrderModel } from './Orders';

export class PaymentGatewayResponseData {
  request_id?: string;
  transaction_id?: string;
  pay_type?: string;
  pay_url?: string;
  deep_link?: string;
  qr_code_url?: string;
  deep_link_mini_app?: string;
  order_type?: string;
  result_code?: number;
  message?: string;
  response_time?: number;
  extra_data?: string;
  signature?: string;
}

@Table({
  modelName: 'transactions',
})
export class TransactionModel extends Model<TransactionModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => OrderModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  order_id: string;

  @Column({
    type: DataType.JSONB,
  })
  payment_provider_response_data: PaymentGatewayResponseData;

  @Column({
    type: DataType.STRING,
    defaultValue: TransactionStatusEnum.PENDING,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payment_method: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payment_type: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  agent_id: string;

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  customer_id: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => AgentModel, 'agent_id')
  agent: AgentModel;

  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => OrderModel, 'order_id')
  order: OrderModel;
}

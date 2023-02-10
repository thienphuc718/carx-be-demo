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
import { CustomerModel, AgentModel, BookingModel, OnsiteRescueResponseModel } from '.';
import { OnsiteRescueRequestStatusEnum } from '../modules/onsite-rescues/enum/OnsiteRescueRequestEnum';

@Table({
  modelName: 'onsite_rescue_requests',
})
export class OnsiteRescueRequestModel extends Model<OnsiteRescueRequestModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  agent_id: string;

  @ForeignKey(() => BookingModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  booking_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rescue_reason: string;

  @Column({
    type: DataType.STRING,
  })
  cancel_reason: string;

  @Column({
    type: DataType.ENUM('SENT', 'CANCELLED', 'COMPLETED', 'PROCESSING'),
    defaultValue: OnsiteRescueRequestStatusEnum.SENT,
  })
  status: OnsiteRescueRequestStatusEnum;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  car_info: Record<string, any>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  customer_info: Record<string, any>;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @BelongsTo(() => BookingModel)
  booking: BookingModel;

  @BelongsTo(() => AgentModel)
  agent: AgentModel;

  @HasMany(() => OnsiteRescueResponseModel)
  responses: OnsiteRescueResponseModel[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

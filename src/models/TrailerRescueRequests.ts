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
import { CustomerModel, AgentModel, BookingModel, TrailerFormerRescueResponseModel, TrailerLaterRescueResponseModel } from '.';
import { TrailerRescueRequestFormerStatusEnum, TrailerRescueRequestLaterStatusEnum,  } from '../modules/trailer-rescues/enum/TrailerRescueRequestEnum';

@Table({
  modelName: 'trailer_rescue_requests',
})
export class TrailerRescueRequestModel extends Model<TrailerRescueRequestModel> {
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
  former_agent_id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  later_agent_id: string;

  @ForeignKey(() => BookingModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  former_booking_id: string;

  @ForeignKey(() => BookingModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  later_booking_id: string;

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
    defaultValue: TrailerRescueRequestFormerStatusEnum.SENT,
  })
  former_status: TrailerRescueRequestFormerStatusEnum;

  @Column({
    type: DataType.ENUM('SENT', 'CANCELLED', 'COMPLETED', 'PROCESSING', 'UNSENT'),
    defaultValue: TrailerRescueRequestLaterStatusEnum.UNSENT,
  })
  later_status: TrailerRescueRequestLaterStatusEnum;

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

  @BelongsTo(() => BookingModel, 'former_booking_id')
  former_booking: BookingModel;

  @BelongsTo(() => BookingModel, 'later_booking_id')
  later_booking: BookingModel;

  @BelongsTo(() => AgentModel, 'former_agent_id')
  former_agent: AgentModel;

  @BelongsTo(() => AgentModel, 'later_agent_id')
  later_agent: AgentModel;

  @HasMany(() => TrailerFormerRescueResponseModel)
  former_responses: TrailerFormerRescueResponseModel[];

  @HasMany(() => TrailerLaterRescueResponseModel)
  later_responses: TrailerLaterRescueResponseModel[];

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

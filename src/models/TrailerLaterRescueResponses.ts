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
import { AgentModel, ServiceModel } from '.';
import { TrailerLaterRescueResponseStatusEnum } from '../modules/trailer-rescues/enum/TrailerLaterRescueResponseEnum';
import { TrailerRescueRequestModel } from './TrailerRescueRequests';

@Table({
  modelName: 'trailer_later_rescue_responses',
})
export class TrailerLaterRescueResponseModel extends Model<TrailerLaterRescueResponseModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => TrailerRescueRequestModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  trailer_rescue_request_id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  agent_id: string;

  @Column({
    type: DataType.ENUM('ACCEPTED', 'REJECTED'),
    defaultValue: TrailerLaterRescueResponseStatusEnum.ACCEPTED,
  })
  status: TrailerLaterRescueResponseStatusEnum;

  @ForeignKey(() => ServiceModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  service_id: string;

  @BelongsTo(() => TrailerRescueRequestModel)
  trailer_rescue_request: TrailerRescueRequestModel;

  @BelongsTo(() => AgentModel)
  agent: AgentModel;

  @BelongsTo(() => ServiceModel)
  rescue_service: ServiceModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  transformToResponse() {
    const trailerLaterRescueResponseDetail = JSON.parse(JSON.stringify(this));
    const { rescue_service, ...rest } = trailerLaterRescueResponseDetail;
    const { product } = rescue_service;
    const variant = product.variants[0];
    const data = {
      ...rest,
      rescue_service: {
        ...rescue_service,
        product: {
          ...product,
          images: variant.images,
          price: variant.price,
          discount_price: variant.discount_price,
          code: variant.sku,
          value: variant.value,
        },
      },
    };
    delete data.rescue_service.product.variants;
    return data;
  }
}

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
import { TrailerFormerRescueResponseStatusEnum } from '../modules/trailer-rescues/enum/TrailerFormerRescueResponseEnum';
import { TrailerRescueRequestModel } from './TrailerRescueRequests';

@Table({
  modelName: 'trailer_former_rescue_responses',
})
export class TrailerFormerRescueResponseModel extends Model<TrailerFormerRescueResponseModel> {
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
    defaultValue: TrailerFormerRescueResponseStatusEnum.ACCEPTED,
  })
  status: TrailerFormerRescueResponseStatusEnum;

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
    const trailerFormerRescueResponseDetail = JSON.parse(JSON.stringify(this));
    const { rescue_service, ...rest } = trailerFormerRescueResponseDetail;
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

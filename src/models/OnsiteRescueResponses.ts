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
import { OnsiteRescueResponseStatusEnum } from '../modules/onsite-rescues/enum/OnsiteRescueResponseEnum';
import { OnsiteRescueRequestModel } from './OnsiteRescueRequests';

@Table({
  modelName: 'onsite_rescue_responses',
})
export class OnsiteRescueResponseModel extends Model<OnsiteRescueResponseModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => OnsiteRescueRequestModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  onsite_rescue_request_id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  agent_id: string;

  @Column({
    type: DataType.ENUM('ACCEPTED', 'CANCELLED'),
    defaultValue: OnsiteRescueResponseStatusEnum.ACCEPTED,
  })
  status: OnsiteRescueResponseStatusEnum;

  @ForeignKey(() => ServiceModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  service_id: string;

  @BelongsTo(() => OnsiteRescueRequestModel)
  onsite_rescue_request: OnsiteRescueRequestModel;

  @BelongsTo(() => AgentModel)
  agent: AgentModel;

  @BelongsTo(() => ServiceModel)
  rescue_service: ServiceModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  transformToResponse() {
    const onsiteRescueResponseDetail = JSON.parse(JSON.stringify(this));
    const { rescue_service, ...rest } = onsiteRescueResponseDetail;
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

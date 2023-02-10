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
import { AgentModel, ProductModel, FlashBuyRequestModel } from '.';
import { FlashBuyResponseStatusEnum } from '../modules/flash-buy-requests/enum/FlashBuyResponseEnum';

@Table({
  modelName: 'flash_buy_responses',
})
export class FlashBuyResponseModel extends Model<FlashBuyResponseModel> {
  @PrimaryKey
  @ForeignKey(() => AgentModel)
  @Column
  agent_id: string;

  @PrimaryKey
  @ForeignKey(() => FlashBuyRequestModel)
  @Column
  flash_buy_request_id: string;

  @ForeignKey(() => ProductModel)
  @Column
  product_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.ENUM('ACCEPTED', 'REJECTED'),
    defaultValue: 'ACCEPTED',
  })
  status: FlashBuyResponseStatusEnum;

  @BelongsTo(() => AgentModel, 'agent_id')
  agent: AgentModel;

  @BelongsTo(() => FlashBuyRequestModel)
  flash_buy_request: FlashBuyRequestModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  transformToResponse() {
    const responseDetail = JSON.parse(JSON.stringify(this));
    const { product, ...rest } = responseDetail;
    let data: any = {};
    if (product) {
      const variant = product.variants[0];
      data = {
        ...rest,
        product: {
          ...product,
          images: variant.images,
          price: variant.price,
          discount_price: variant.discount_price,
          sku: variant.sku,
          quantity: variant.quantity,
        },
      };
      delete data.product.variants;
    } else {
      data = {
        ...rest,
      };
    }
    return data;
  }
}

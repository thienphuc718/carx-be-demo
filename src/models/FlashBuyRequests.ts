import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { AgentModel, CustomerModel } from '.';
import { FlashBuyResponseModel } from '.';
import { FlashBuyResponseStatusEnum } from '../modules/flash-buy-requests/enum/FlashBuyResponseEnum';

@Table({
  modelName: 'flash_buy_requests',
})
export class FlashBuyRequestModel extends Model<FlashBuyRequestModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  product_description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product_image: string;

  // @Column({
  //   type: DataType.STRING,
  // })
  // product_color: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product_name: string;

  @ForeignKey(() => CustomerModel)
  @Column
  customer_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_done: boolean;

  @Column({
    type: DataType.STRING,
  })
  converted_product_name: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_product_name: string;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @BelongsToMany(() => AgentModel, () => FlashBuyResponseModel)
  agents: AgentModel[];

  @HasMany(() => FlashBuyResponseModel)
  responses: FlashBuyResponseModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  transformToResponse() {
    const request = JSON.parse(JSON.stringify(this));
    const { responses = [], converted_product_name, tsv_converted_product_name, ...requestData } = request;

    const data = {
      ...requestData,
      responses: responses,
      total_accepted_response: responses.filter(
        (response) => response.status === FlashBuyResponseStatusEnum.ACCEPTED,
      ).length,
    };
    return data;
  }
}

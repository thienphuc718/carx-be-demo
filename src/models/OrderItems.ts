import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { OrderModel } from './Orders';
import { ProductModel } from './Products';

@Table({
  modelName: 'order_items',
})
export class OrderItemModel extends Model<OrderItemModel> {
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

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product_sku: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_incurring: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @BelongsTo(() => OrderModel, 'order_id')
  order: OrderModel;

  @BelongsTo(() => ProductModel, 'product_id')
  product: ProductModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  static transformToOrderItemDetail() {
    const orderItemDetail = JSON.parse(JSON.stringify(this));
    const data = {
      id: orderItemDetail.id,
      product_sku: orderItemDetail.product_sku,
      quantity: orderItemDetail.quantity,
      price: orderItemDetail.price,
      image: orderItemDetail.image,
      is_deleted: orderItemDetail.is_deleted,
      created_at: orderItemDetail.created_at,
      updated_at: orderItemDetail.updated_at,
      product: orderItemDetail.product
    };
    return data;
  }
}

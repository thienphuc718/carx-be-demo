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
import { AgentModel } from './Agents';
import { CustomerModel } from './Customers';
import { OrderModel } from './Orders';
import { ProductModel } from './Products';
import { ServiceModel } from './Services';

@Table({
  modelName: 'reviews',
})
export class ReviewModel extends Model<ReviewModel> {
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

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  agent_id: string;

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
  })
  product_id: string;

  @ForeignKey(() => ServiceModel)
  @Column({
    type: DataType.UUID,
  })
  service_id: string;

  @Column({
    type: DataType.DECIMAL,
  })
  points: number;

  @Column({
    type: DataType.TEXT,
  })
  content: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  images: string[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @BelongsTo(() => AgentModel)
  agent: AgentModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  @BelongsTo(() => ServiceModel)
  service: ServiceModel;
}

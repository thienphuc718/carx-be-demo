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
import { OrderModel } from './Orders';
import { ProductModel } from './Products';

@Table({
  modelName: 'insurance_contracts',
})
export class InsuranceContractModel extends Model<InsuranceContractModel> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  customer_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer_email: string;

  @Column({
    type: DataType.STRING,
  })
  customer_phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer_certificate_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer_certificate_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  frame_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  engine_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contract_no: string;

  @Column({
    type: DataType.STRING,
  })
  voluntary_contract_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  carx_contract_number: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  send_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date: Date;

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  insurance_amount: number;

  @Column({
    type: DataType.DOUBLE,
  })
  voluntary_insurance_amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  car_type_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  usage_code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacity: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => OrderModel, 'order_id')
  order: OrderModel;

  @BelongsTo(() => ProductModel, 'product_id')
  product: ProductModel;
}

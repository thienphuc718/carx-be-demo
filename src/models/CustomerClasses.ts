import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { CustomerModel } from './Customers';

@Table({
  modelName: 'customer_classes',
})
export class CustomerClassModel extends Model<CustomerClassModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  min_point: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  max_point: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @HasMany(() => CustomerModel)
  customer: CustomerModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

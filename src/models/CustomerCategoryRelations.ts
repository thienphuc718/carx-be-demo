import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { CustomerCategoryModel } from './CustomerCategories';
import { CustomerModel } from './Customers';

@Table({
  modelName: 'customer_category_relations',
})
export class CustomerCategoryRelationsModel extends Model<CustomerCategoryRelationsModel> {
  @PrimaryKey
  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @PrimaryKey
  @ForeignKey(() => CustomerCategoryModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_category_id: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { CustomerCategoryRelationsModel } from './CustomerCategoryRelations';
import { CustomerModel } from './Customers';

@Table({
  modelName: 'customer_categories',
})
export class CustomerCategoryModel extends Model<CustomerCategoryModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @BelongsToMany(() => CustomerModel, () => CustomerCategoryRelationsModel)
  customers: CustomerModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

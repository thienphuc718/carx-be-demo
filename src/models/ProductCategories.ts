import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsTo,
  BelongsToMany,
  PrimaryKey,
} from 'sequelize-typescript';
// import { ProductCategorySelectedModel } from './ProductCategorySelected';
// import { ProductModel } from './Products';

@Table({
  modelName: 'product_categories',
})
export class ProductCategoryModel extends Model<ProductCategoryModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
  })
  parent_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ProductCategoryModel, 'parent_id')
  parent: ProductCategoryModel;

  // @BelongsToMany(() => ProductModel, () => ProductCategorySelectedModel)
  // products: ProductModel[];
}

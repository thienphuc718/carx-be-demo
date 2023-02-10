import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ProductModel } from './Products';
import { ProductCategoryModel } from './ProductCategories';
import { ServiceCategoryModel } from './ServiceCategories';

@Table({
  modelName: 'product_category_selecteds',
})

export class ProductCategorySelectedModel extends Model<ProductCategorySelectedModel> {
  @ForeignKey(() => ProductModel)
  @Column
  product_id: string;

  @ForeignKey(() => ServiceCategoryModel)
  @Column
  category_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ServiceCategoryModel)
  category_details: ServiceCategoryModel;

  @BelongsTo(() => ProductModel)
  product_details: ProductModel;
}

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
import { ProductAttributeValueDto } from '../modules/products/dto/ProductAttributeDto';
import { ProductAttributeModel } from './ProductAttributes';
import { ProductModel } from './Products';

@Table({
  modelName: 'product_attribute_selecteds',
})
export class ProductAttributeSelectedModel extends Model<ProductAttributeSelectedModel> {
  @ForeignKey(() => ProductModel)
  @Column
  product_id: string;

  @ForeignKey(() => ProductAttributeModel)
  @Column
  attribute_id: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  order: number;

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
    allowNull: false,
  })
  values: ProductAttributeValueDto[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ProductAttributeModel)
  attribute_details: ProductAttributeModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}

import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsToMany,
  PrimaryKey,
} from 'sequelize-typescript';
import { ProductAttributeValueDto } from '../modules/products/dto/ProductAttributeDto';
import { ProductAttributeSelectedModel } from './ProductAttributeSelected';
import { ProductModel } from './Products';

@Table({
  modelName: 'product_attributes',
})
export class ProductAttributeModel extends Model<ProductAttributeModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

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

  @BelongsToMany(() => ProductModel, () => ProductAttributeSelectedModel)
  products: ProductModel[];
}

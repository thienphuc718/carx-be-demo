import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { ProductVariantValueDto } from '../modules/products/dto/ProductVariantDto';
import { ProductModel } from './Products';

interface IProductVariantModel extends ProductVariantModel {
  product_id: string;
}

@Table({
  modelName: 'product_variants',
})

export class ProductVariantModel extends Model<IProductVariantModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  images: string[];

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  discount_price: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sku: string;

  // [{ attribute_id, attribute_value }]
  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  value: ProductVariantValueDto[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ProductModel, 'product_id')
  product_details: ProductModel;
}

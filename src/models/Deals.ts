import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ProductModel, SectionDealRelationModel, SectionModel } from '.';

@Table({
  modelName: 'deals',
})
export class DealModel extends Model<DealModel> {
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
  title: string;

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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_hot_deal: boolean;

  @ForeignKey(() => ProductModel)
  @Column
  product_id: string;

  @Column({
    type: DataType.STRING,
  })
  converted_title: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_title: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ProductModel, 'product_id')
  product: ProductModel;

  @BelongsToMany(() => SectionModel, () => SectionDealRelationModel)
  section_relation: SectionDealRelationModel[];

  transformToResponse() {
    const { product, converted_title, tsv_converted_title, ...dealInfo } = JSON.parse(JSON.stringify(this));
    const data = {
      type: product.type,
      ...dealInfo,
    };
    if (product && product.name) {
      data.product_name = product.name
    }
    return data;
  }
}

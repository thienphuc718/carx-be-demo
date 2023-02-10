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
import { ProductModel } from './Products';
import { SectionModel } from './Sections';

@Table({
  modelName: 'section_product_relations',
})
export class SectionProductRelationModel extends Model<SectionProductRelationModel> {
  @PrimaryKey
  @ForeignKey(() => SectionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  section_id: string;

  @PrimaryKey
  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  order: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => SectionModel, 'section_id')
  section: SectionModel;

  @BelongsTo(() => ProductModel, 'product_id')
  product: ProductModel;
}

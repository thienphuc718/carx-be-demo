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
import { PromotionModel } from './Promotions';
import { SectionModel } from './Sections';

@Table({
  modelName: 'section_promotion_relations',
})
export class SectionPromotionRelationModel extends Model<SectionPromotionRelationModel> {
  @PrimaryKey
  @ForeignKey(() => SectionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  section_id: string;

  @PrimaryKey
  @ForeignKey(() => PromotionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  promotion_id: string;

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

  @BelongsTo(() => PromotionModel, 'promotion_id')
  promotion: PromotionModel;
}

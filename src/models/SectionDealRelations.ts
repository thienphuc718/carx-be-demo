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
import { DealModel } from './Deals';
import { SectionModel } from './Sections';

@Table({
  modelName: 'section_deal_relations',
})
export class SectionDealRelationModel extends Model<SectionDealRelationModel> {
  @PrimaryKey
  @ForeignKey(() => SectionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  section_id: string;

  @PrimaryKey
  @ForeignKey(() => DealModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  deal_id: string;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  order: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => DealModel, 'deal_id')
  deal: DealModel;

  @BelongsTo(() => SectionModel, 'section_id')
  section: SectionModel;
}

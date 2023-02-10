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
import { PromotionModel } from './Promotions';

@Table({
  modelName: 'promotion-applies',
})
export class PromotionApplyModel extends Model<PromotionApplyModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  object_name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  object_id: number;

  @ForeignKey(() => PromotionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  promotion_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @BelongsTo(() => PromotionModel)
  promotion: PromotionModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

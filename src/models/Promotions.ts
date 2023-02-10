import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {GiftModel} from './Gifts';
import {AgentModel} from './Agents';

import {
  PromotionDiscountTypeEnum,
  PromotionProviderEnum,
  PromotionStatusEnum,
} from '../modules/promotions/enum/PromotionEnum';
import {SectionPromotionRelationModel} from './SectionPromotionRelations';
import {SectionModel} from './Sections';

const today = new Date();

@Table({
  modelName: 'promotions',
})
export class PromotionModel extends Model<PromotionModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.TEXT,
  })
  name: string;

  @Column({
    type: DataType.UUID,
  })
  agent_id: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  discount_type: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_used: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  type: number;

  @ForeignKey(() => GiftModel)
  @Column({
    type: DataType.UUID,
  })
  gift_id: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.DATE,
    defaultValue: today,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: new Date(new Date().setFullYear(today.getFullYear() + 100)),
  })
  end_date: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_applied_all: boolean;

  // min order value
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  min_value: number;

  // max promotion value
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  max_value: number;

  @Column({
    type: DataType.ENUM('CREATED', 'ACTIVATING', 'EXPIRED'),
    defaultValue: 'CREATED',
  })
  status: PromotionStatusEnum;

  @Column({
    type: DataType.ENUM('AGENT', 'CARX'),
    allowNull: false,
  })
  provider: PromotionProviderEnum;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.STRING,
  })
  converted_name: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_name: string;

  @BelongsTo(() => AgentModel, 'agent_id')
  agent_details: AgentModel;

  @BelongsTo(() => GiftModel)
  gift: GiftModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsToMany(() => SectionModel, () => SectionPromotionRelationModel)
  section_promotions: SectionPromotionRelationModel[];

  transformToResponse() {
    const promotionData = JSON.parse(JSON.stringify(this));
    let {
      is_applied_all,
      is_deleted,
      type,
      gift_id,
      discount_type,
      max_value,
      min_value,
      converted_name,
      tsv_converted_name,
      ...promotion
    } = promotionData;
    if (discount_type == PromotionDiscountTypeEnum.BY_PERCENTAGE) {
      promotion.discount_type = 'BY_PERCENTAGE';
    } else {
      promotion.discount_type = 'BY_PRICE';
    }
    return {
      ...promotion,
      max_value: Number(max_value),
      min_value: Number(min_value),
    };
  }
}

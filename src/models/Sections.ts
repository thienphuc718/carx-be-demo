import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  AgentModel,
  DealModel,
  PostModel,
  ProductModel,
  PromotionModel,
  SectionDealRelationModel,
  SectionPostRelationModel,
  SectionProductRelationModel,
  SectionPromotionRelationModel,
} from '.';
import { SectionTypeEnum } from '../modules/sections/enums/SectionEnum';
import { SectionAgentRelationModel } from './SectionAgentRelations';

export class SectionConfig {
  layout: string;
  auto_play: boolean;
}

@Table({
  modelName: 'sections',
})
export class SectionModel extends Model<SectionModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  config: SectionConfig;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: SectionTypeEnum;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_item_editable: boolean;

  @Column({
    type: DataType.STRING,
  })
  mobile_screen: string;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  order: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_enabled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isnoticeable: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsToMany(() => AgentModel, () => SectionAgentRelationModel)
  section_agents: SectionAgentRelationModel[];

  @BelongsToMany(() => PromotionModel, () => SectionPromotionRelationModel)
  section_promotions: SectionPromotionRelationModel[];

  @BelongsToMany(() => PostModel, () => SectionPostRelationModel)
  section_posts: SectionPostRelationModel[];

  @BelongsToMany(() => DealModel, () => SectionDealRelationModel)
  section_deals: SectionDealRelationModel[];

  @BelongsToMany(() => ProductModel, () => SectionProductRelationModel)
  section_products: SectionProductRelationModel[];
}

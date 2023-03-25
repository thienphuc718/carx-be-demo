import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  HasMany,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductModel } from './Products';
import { ServiceCategoryModel } from './ServiceCategories';
import { AgentModel } from './Agents';
import { ServiceCategoryRelationModel } from './ServiceCategoryRelations';
import { OnsiteRescueResponseModel } from './OnsiteRescueResponses';
import { ReviewModel } from './Reviews';
import { AgentCategoryModel } from './AgentCategories';

export class KeyPairValueType {
  key: string;
  value: string;
}

@Table({
  modelName: 'services',
})
export class ServiceModel extends Model<ServiceModel> {
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
    type: DataType.TEXT,
  })
  note: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  other_info: KeyPairValueType[];

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
  })
  product_id: string;

  @Column({
    type: DataType.UUID,
  })
  agent_id: string;

  @Column({
    type: DataType.BIGINT,
    defaultValue: 0,
  })
  view_count: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_rescue_service: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @ForeignKey(() => AgentCategoryModel)
  @Column
  agent_category_id: string;

  @Column({
    type: DataType.STRING,
  })
  converted_name: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => AgentModel, 'agent_id')
  agent_details: AgentModel;

  @HasMany(() => ServiceCategoryRelationModel)
  categories: ServiceCategoryRelationModel[];

  @HasMany(() => ReviewModel, 'service_id')
  reviews: ReviewModel[];

  @BelongsToMany(() => ServiceCategoryModel, () => ServiceCategoryRelationModel)
  category_relations: ServiceCategoryRelationModel[];

  @BelongsTo(() => ProductModel, 'product_id')
  product: ProductModel;

  @HasMany(() => OnsiteRescueResponseModel, 'service_id')
  onsite_rescue_responses: OnsiteRescueResponseModel[];

  @BelongsTo(() => AgentCategoryModel, 'agent_category_id')
  agent_category: AgentCategoryModel;

  transformToResponse() {
    const { product, ...service } = JSON.parse(JSON.stringify(this));
    const variant = product.variants[0];
    const data = {
      id: service.id,
      // user_id: service.user_id,
      name: service.name,
      note: service.note,
      description: service.description,
      images: variant.images,
      price: variant.price,
      discount_price: variant.discount_price,
      code: variant.sku,
      agent_details: service.agent_details,
      // currency_unit: product.currency_unit,
      agent_id: service.agent_details.id,
      status: product.status,
      is_guaranteed: product.is_guaranteed,
      guarantee_time_unit: product.guarantee_time_unit,
      guarantee_time: product.guarantee_time,
      other_info: service.other_info,
      view_count: Number(service.view_count),
      is_rescue_service: service.is_rescue_service,
      agent_category_id: service.agent_category_id,
      created_at: service.created_at,
      updated_at: service.updated_at,
      categories: service.categories,
      product_id: service.product_id,
    };
    return data;
  }
}

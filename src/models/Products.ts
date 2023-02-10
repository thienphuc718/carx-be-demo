import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsTo,
  HasMany,
  BelongsToMany,
  PrimaryKey,
  ForeignKey, HasOne, BeforeCreate, BeforeUpdate,
} from 'sequelize-typescript';
import { ProductEntityDto } from '../modules/products/dto/ProductDto';
import {
  ProductStatusEnum,
  ProductTypeEnum,
  CurrencyUnitEnum,
  ProductGuaranteeTimeUnitEnum,
} from '../modules/products/enum/ProductEnum';
import { ProductAttributeModel } from './ProductAttributes';
import { ProductAttributeSelectedModel } from './ProductAttributeSelected';
import { ProductBrandModel } from './ProductBrands';
import { ProductCategoryModel } from './ProductCategories';
import { ProductCategorySelectedModel } from './ProductCategorySelected';
import { ProductVariantModel } from './ProductVariants';
import { AgentModel } from './Agents';
import { ServiceCategoryModel } from './ServiceCategories';
import { OrderItemModel } from './OrderItems';
import { ServiceModel } from './Services';
import { FlashBuyResponseModel } from './FlashBuyResponses';
import { ReviewModel } from './Reviews';
import { AgentCategoryModel } from './AgentCategories';
import { SectionModel } from './Sections';
import { SectionProductRelationModel } from './SectionProductRelations';
import {InsuranceProductModel} from "./InsuranceProducts";
import {InsuranceContractModel} from "./InsuranceContracts";

export class KeyPairValueType {
  key: string;
  value: string;
}

@Table({
  modelName: 'products',
})
export class ProductModel extends Model<ProductEntityDto> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
  })
  agent_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_variable: boolean;

  @Column({
    type: DataType.ENUM('VND', 'USD'),
    defaultValue: CurrencyUnitEnum.VND,
  })
  currency_unit: CurrencyUnitEnum;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_guaranteed: boolean;

  @Column({
    type: DataType.ENUM('DAY', 'WEEK', 'MONTH', 'YEAR'),
    defaultValue: ProductGuaranteeTimeUnitEnum.YEAR,
  })
  guarantee_time_unit: ProductGuaranteeTimeUnitEnum;

  @Column({
    type: DataType.INTEGER,
  })
  guarantee_time: number;

  @Column({
    type: DataType.ENUM('PHYSICAL', 'SERVICE'),
    defaultValue: ProductTypeEnum.PHYSICAL,
    allowNull: false,
  })
  type: ProductTypeEnum;

  @Column({
    type: DataType.ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'),
    allowNull: false,
    defaultValue: ProductStatusEnum.ACTIVE,
  })
  status: ProductStatusEnum;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataType.TEXT,
  })
  guarantee_note: string;

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  other_info: KeyPairValueType[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  tags: string[];

  @Column({
    type: DataType.UUID,
  })
  brand_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_top_product: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_insurance_product: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_flash_buy: boolean;

  @Column({
    type: DataType.BIGINT,
    defaultValue: 0,
  })
  view_count: number;

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

  @BelongsTo(() => ProductBrandModel, 'brand_id')
  brand: ProductBrandModel;

  @HasMany(() => ProductVariantModel, 'product_id')
  variants: ProductVariantModel[];

  @BelongsToMany(() => ServiceCategoryModel, () => ProductCategorySelectedModel)
  selected_categories: ProductCategorySelectedModel[];

  @HasMany(() => ProductCategorySelectedModel)
  categories: ProductCategorySelectedModel[];

  @ForeignKey(() => AgentCategoryModel)
  @Column
  agent_category_id: string;
  
  @BelongsToMany(
    () => ProductAttributeModel,
    () => ProductAttributeSelectedModel,
  )
  selected_attributes: ProductAttributeSelectedModel[];

  @BelongsTo(() => AgentModel, 'agent_id')
  agent_details: AgentModel;

  @HasMany(() => ProductAttributeSelectedModel)
  attributes: ProductAttributeSelectedModel[];

  @HasMany(() => OrderItemModel, 'product_id')
  order_items: OrderItemModel[];

  @HasMany(() => ServiceModel, 'product_id')
  services: ServiceModel[];

  @HasMany(() => FlashBuyResponseModel, 'product_id')
  flash_buy_responses: FlashBuyResponseModel[];

  @HasMany(() => ReviewModel, 'product_id')
  reviews: ReviewModel[];

  @BelongsTo(() => AgentCategoryModel, 'agent_category_id')
  agent_category: AgentCategoryModel;
  
  @BelongsToMany(() => SectionModel, () => SectionProductRelationModel)
  section_products: SectionProductRelationModel[];

  @HasOne(() => InsuranceProductModel, 'product_id')
  insurance_product: InsuranceProductModel;

  @HasMany(() => InsuranceContractModel, 'product_id')
  insurance_contracts: InsuranceContractModel[];

  transformToResponse(additionalField?: any) {
    const productData = JSON.parse(JSON.stringify(this));
    try {
      if (this.is_variable) {
        return productData;
      } else {
        const {
          is_variable,
          is_deleted,
          currency_unit,
          type,
          slug,
          tags,
          brand_id,
          brand,
          categories,
          view_count,
          variants,
          converted_name,
          tsv_converted_name,
          ...productDetail
        } = productData;
        const variant = variants[0];
        let mappedDetails = {
          ...productDetail,
          view_count: Number(view_count),
          images: variant.images,
          price: variant.price,
          discount_price: variant.discount_price,
          quantity: variant.quantity,
          sku: variant.sku,
          ...additionalField
        };
        delete mappedDetails.variants;
        delete mappedDetails.attributes;
        return mappedDetails;
      }
    } catch (error) {
      throw error;
    }
  }
}

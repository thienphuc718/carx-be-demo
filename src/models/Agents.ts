import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { AgentPaymentMethodDto } from '../modules/agents/dto/AgentDto';
import { UserModel } from './Users';
import { ProductModel } from './Products';
import { ServiceModel } from './Services';
import { PromotionModel } from './Promotions';
import { CustomerAgentRelationsModel } from './CustomerAgentRelations';
import {
  AgentCategoryModel,
  ChatConversationModel,
  CustomerModel,
  FlashBuyResponseModel,
  FlashBuyRequestModel,
  OnsiteRescueResponseModel,
  ReviewModel,
  SectionAgentRelationModel,
  SectionModel,
} from '.';
import { DealModel } from './Deals';
import { BookingModel } from './Bookings';
import { TransactionModel } from './Transactions';

@Table({
  modelName: 'agents',
})
export class AgentModel extends Model<AgentModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  avatar: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  images: string[];

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  payment_method: AgentPaymentMethodDto[];

  @Column({
    type: DataType.DECIMAL,
    defaultValue: 0,
  })
  rating_points: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  count_review: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  top_agent: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  authentic_agent: boolean;

  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  order: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_hidden: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.JSON,
  })
  geo_info: any;

  @Column({
    type: DataType.DOUBLE,
  })
  longitude: number;

  @Column({
    type: DataType.DOUBLE,
  })
  latitude: number;

  @ForeignKey(() => AgentCategoryModel)
  @Column({
    type: DataType.UUID,
  })
  category_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_activated: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasMany(() => PromotionModel, 'agent_id')
  promotions: PromotionModel[];

  @HasMany(() => ProductModel, 'agent_id')
  products: ProductModel[];

  @HasMany(() => ServiceModel, 'agent_id')
  services: ServiceModel[];

  @BelongsTo(() => UserModel, 'user_id')
  user_details: UserModel;

  @BelongsToMany(() => CustomerModel, () => CustomerAgentRelationsModel)
  customers: CustomerModel[];

  // @HasMany(() => DealModel)
  // deals: DealModel[];

  @HasMany(() => BookingModel, 'agent_id')
  bookings: BookingModel[];

  @BelongsToMany(() => FlashBuyRequestModel, () => FlashBuyResponseModel)
  flash_buy_requests: FlashBuyRequestModel[];

  @HasMany(() => OnsiteRescueResponseModel, 'agent_id')
  onsite_rescue_responses: OnsiteRescueResponseModel[];

  @BelongsTo(() => AgentCategoryModel)
  category: AgentCategoryModel;

  @HasMany(() => ChatConversationModel)
  conversations: ChatConversationModel[];

  @BelongsToMany(() => SectionModel, () => SectionAgentRelationModel)
  section_agents: SectionAgentRelationModel[];

  @HasMany(() => ReviewModel)
  reviews: ReviewModel[];

  @HasMany(() => TransactionModel)
  transactions: TransactionModel[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_orders: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_revenue: number;

  @Column({
    type: DataType.STRING,
  })
  converted_name: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_name: string;

  transformToResponse() {
    try {
      const agentData = JSON.parse(JSON.stringify(this));
      const {
        user_id,
        user_details,
        is_deleted,
        created_at,
        updated_at,
        products,
        services,
        promotions,
        customers,
        bookings,
        converted_name,
        tsv_converted_name,
        ...agent
      } = agentData;

      let company = null;
      let user = null;
      if (
        user_details &&
        user_details.companies &&
        user_details.companies.length
      ) {
        const { companies, role_id, social_info, ...user_info } = user_details;
        user = user_info;
        company = user_details.companies[0];
        if (user_details.companies[0].company_relations) {
          company = {
            ...user_details.companies[0].company_relations,
          };
        }
      }
      let productList = [];
      let serviceList = [];
      let promotionList = [];
      if (promotions && promotions.length > 0) {
        for (let i = 0; i < promotions.length; i++) {
          let { agent_details, ...promotionData } = promotions[i];
          promotionList.push({
            ...promotionData,
          });
        }
      }
      if (products && products.length > 0) {
        for (let i = 0; i < products.length; i++) {
          let { variants, ...productData } = products[i];
          productList.push({
            ...productData,
            price: variants && variants.length ? variants[0].price : null,
            discount_price:
              variants && variants.length ? variants[0].discount_price : null,
            sku: variants && variants.length ? variants[0].sku : null,
            images: variants && variants.length ? variants[0].images : null,
            quantity: variants && variants.length ? variants[0].quantity : null,
          });
        }
      }
      if (services && services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          let { categories, ...serviceData } = services[i];
          let categoriesData = [];
          for (let j = 0; j < categories.length; j++) {
            categoriesData.push({
              id: categories[0].category_id,
              name: categories[0].category_details.name,
            });
          }
          serviceList.push({
            ...serviceData,
            categories: categoriesData,
          });
        }
      }

      // CONVERT MIN PRICE FROM QUERY SELECT
      if (agent['min_price']) {
        agent['min_price'] = Number(agent['min_price']);
      } else {
        agent['min_price'] = 0;
      }
      return {
        ...agent,
        max_price: 999999999,
        products: productList,
        services: serviceList,
        promotions: promotionList,
        user_info: user,
        company: company,
      };
    } catch (error) {
      throw error;
    }
  }
}

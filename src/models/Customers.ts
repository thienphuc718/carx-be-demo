import { CustomerCategoryModel } from './CustomerCategories';
import { CustomerClassModel } from './CustomerClasses';
import { DistrictModel } from './Districts';
import { CityModel } from './Cities';
import {
  BelongsTo,
  HasOne,
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { CustomerClubModel } from './CustomerClubs';
import { CustomerCategoryRelationsModel } from './CustomerCategoryRelations';
import { UserModel } from './Users';
import { CarModel } from './Cars';
import { AgentModel, ChatConversationModel, OnsiteRescueRequestModel, ReviewModel } from '.';
import { CustomerAgentRelationsModel } from './CustomerAgentRelations';
import { OrderModel } from './Orders';
import { BookingModel } from './Bookings';
import { TransactionModel } from './Transactions';
@Table({
  modelName: 'customers',
})
export class CustomerModel extends Model<CustomerModel> {
  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
  })
  user_id: string;

  @Column({
    type: DataType.STRING,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  avatar: string;

  @Column({
    type: DataType.STRING,
  })
  gender: string;

  @Column({
    type: DataType.DATE,
  })
  birthday: Date;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  note: string;

  @Column({
    type: DataType.STRING,
  })
  country_code: string;

  @ForeignKey(() => CityModel)
  @Column({
    type: DataType.STRING,
  })
  city_id: string;

  @ForeignKey(() => DistrictModel)
  @Column({
    type: DataType.STRING,
  })
  district_id: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @ForeignKey(() => CustomerClassModel)
  @Column({
    type: DataType.STRING,
  })
  customer_class_id: string;

  @ForeignKey(() => CustomerClubModel)
  @Column({
    type: DataType.STRING,
  })
  customer_club_id: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  tags: string[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  point: number;

  @Column({
    type: DataType.INTEGER,
  })
  available_points: number;

  @BelongsTo(() => UserModel, 'user_id')
  user_details: UserModel;

  @HasOne(() => CarModel, 'customer_id')
  car_details: CarModel;

  @Column({
    type: DataType.STRING,
  })
  converted_full_name: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_full_name: string;

  @BelongsToMany(
    () => CustomerCategoryModel,
    () => CustomerCategoryRelationsModel,
  )
  categories: CustomerCategoryModel;

  @BelongsToMany(() => AgentModel, () => CustomerAgentRelationsModel)
  agents: AgentModel[];
  
  @HasMany(() => OrderModel)
  orders: OrderModel[];

  @HasMany(() => BookingModel, 'customer_id')
  bookings: BookingModel[];

  @HasMany(() => OnsiteRescueRequestModel, 'customer_id')
  onsite_rescue_requests: OnsiteRescueRequestModel[];

  @HasMany(() => ChatConversationModel)
  conversations: ChatConversationModel[];

  @HasMany(() => ReviewModel, 'customer_id')
  reviews: ReviewModel[];

  @HasMany(() => TransactionModel)
  transactions: TransactionModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  transformToResponse() {
    const { orders, car_details, user_details, converted_full_name, tsv_converted_full_name, ...customerData } = JSON.parse(JSON.stringify(this));
    const orderList = [];
    let total_value = 0;
    if (orders && orders.length > 0) {
      for (let i = 0; i < orders.length; i++) {
        total_value += orders[i].value;
        orderList.push(orders[i]);
      }
    }
    return {
      ...customerData,
      total_orders: orderList.length,
      latest_order: orderList[0] ? orderList[0] : null,
      total_value: total_value,
      car: car_details,
      user: user_details,
    }
  }
}

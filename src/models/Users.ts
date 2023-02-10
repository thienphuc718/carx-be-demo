import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsToMany,
  HasOne,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { CompanyModel } from './Companies';
import { AgentModel } from './Agents';
import { UserCompanyRelationsModel } from './UserCompanyRelations';
import { RoleModel } from './Roles';
import { StaffModel } from './Staffs';
import { CommentModel, CustomerModel, LikeModel, NotificationModel, PostModel } from '.';
import { ActivityModel } from './Activities';

@Table({
  modelName: 'users',
})
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  current_location: string;

  @Column({
    type: DataType.JSONB,
  })
  current_location_geo: Record<string, any>;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Column({
    type: DataType.TEXT,
  })
  token: string;

  @Column({
    type: DataType.TEXT,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  method: string;

  @Column({
    type: DataType.STRING,
  })
  otp: string;

  @Column({
    type: DataType.STRING,
  })
  country_code: string;

  @Column({
    type: DataType.STRING,
  })
  city: string;

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
  full_name: string;

  @Column({
    type: DataType.STRING,
  })
  avatar: string;

  @Column({
    type: DataType.STRING,
  })
  cover: string;

  @Column({
    type: DataType.STRING,
  })
  schema: string;

  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.UUID,
  })
  role_id: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_banned: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_verified: boolean;

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  social_info: Array<any>;

  @BelongsToMany(() => CompanyModel, () => UserCompanyRelationsModel)
  company_relations: CompanyModel[];

  @HasMany(() => UserCompanyRelationsModel, 'user_id')
  companies: UserCompanyRelationsModel[];

  @HasOne(() => AgentModel, 'user_id')
  agent_details: AgentModel;

  @HasOne(() => StaffModel, 'user_id')
  staff_details: StaffModel;

  @HasOne(() => CustomerModel, 'user_id')
  customer_details: CustomerModel;

  @BelongsTo(() => RoleModel, 'role_id')
  role: RoleModel;

  @HasMany(() => ActivityModel, 'user_id')
  activities: ActivityModel[];

  @HasMany(() => NotificationModel, 'user_id')
  notifications: NotificationModel[];

  @HasMany(() => LikeModel, 'user_id')
  likes: LikeModel[];

  @HasMany(() => CommentModel, 'user_id')
  comments: CommentModel[];

  @HasMany(() => PostModel, 'user_id')
  posts: PostModel[];

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @Column({
    type: DataType.DATE,
  })
  otp_expiry_time: Date;

  transformToResponse() {
    try {
      let {
        password,
        method,
        otp,
        schema,
        role_id,
        is_banned,
        social_info,
        is_deleted,
        companies,
        agent_details,
        customer_details,
        staff_details,
        current_location,
        otp_expiry_time,
        ...userPayload
      } = JSON.parse(JSON.stringify(this));
      if (agent_details && agent_details.id) {
        const agentReturnKeys = [
          "id",
          "name",
          "phone_number",
          "address",
          "avatar",
          "images",
          "top_agent",
          "order",
          "description",
          "payment_method",
          "created_at",
          "updated_at",
          "category_id",
          'is_deleted',
          'is_hidden'
        ];
        const agentDetailResponse = Object.keys(agent_details)
          .filter((key) => agentReturnKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = agent_details[key];
            return obj;
          }, {});
        // TODO: Temporarily setting current_location = 0
        return {
          ...userPayload,
          // current_location: 0,
          company:
            Array.isArray(companies) && companies.length
              ? companies[0].company_relations
              : null,
          agent: agentDetailResponse,
        };
      } else if (customer_details) {
        const { car_details, ...customerDetail } = customer_details;
        const customerReturnKeys = [
          'id',
          'full_name',
          'phone_number',
          'email',
          'birthday',
          'images',
          'gender',
          'address',
          'note',
          'country_code',
          'point',
          'tags',
          'created_at',
          'updated_at',
        ];
        const customerDetailResponse = Object.keys(customerDetail)
          .filter((key) => customerReturnKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = customer_details[key];
            return obj;
          }, {});
        return {
          ...userPayload,
          // current_location: 0,
          company:
            Array.isArray(companies) && companies.length
              ? companies[0].company_relations
              : null,
          customer: customerDetailResponse,
          car: car_details ? car_details : null,
        };
      } else {
        return {
          ...userPayload,
          // current_location: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  transformToStaffAuth() {
    try {
      let {
        password,
        method,
        otp,
        role_id,
        is_banned,
        social_info,
        is_deleted,
        companies,
        staff_details,
        customer_details,
        agent_details,
        role,
        ...userPayload
      } = JSON.parse(JSON.stringify(this));
      const { permissions, ...role_details } = role;
      const staff_permissions = permissions.map(
        (permission) => permission.feature.name,
      );
      return {
        ...userPayload,
        role: role_details,
        staff: staff_details,
        permissions: staff_permissions,
      };
    } catch (error) {
      throw error;
    }
  }
}

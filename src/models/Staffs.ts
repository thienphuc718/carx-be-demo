import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { StaffStatusEnum } from '../modules/staffs/enum/StaffEnum';
import { UserModel } from './Users';

@Table({
  modelName: 'staffs',
})
export class StaffModel extends Model<StaffModel> {
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
    defaultValue: StaffStatusEnum.ACTIVE,
  })
  status: StaffStatusEnum;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

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

  @BelongsTo(() => UserModel, 'user_id')
  user_details: UserModel;

  transformToResponse() {
    try {
      const { id, user_details, status, name } = JSON.parse(JSON.stringify(this));
      return {
        id,
        name: name,
        email: user_details ? user_details.email : '',
        role: user_details && user_details.role ? user_details.role.name : '',
        status,
      };
    } catch (error) {
      throw error;
    }
  }
}

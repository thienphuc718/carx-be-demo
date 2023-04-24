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
import { UserModel } from '.';

@Table({
  modelName: 'affiliates',
})
export class ActivityModel extends Model<ActivityModel> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  affliate_code: string;

  @Column({
    type: DataType.JSONB,
  })
  data: Record<string, any>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @BelongsTo(() => UserModel)
  user_details: UserModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

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
import { ActivityCodeEnum } from '../modules/activities/enum/ActivityEnum';

@Table({
  modelName: 'activities',
})
export class ActivityModel extends Model<ActivityModel> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  entity_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.JSONB,
  })
  data: Record<string, any>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  entity_name: string;

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

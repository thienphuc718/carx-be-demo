import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { PostModel, UserModel } from '.';

@Table({
  tableName: 'likes',
})
export class LikeModel extends Model<LikeModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => UserModel)
  @Column
  user_id: string;

  @ForeignKey(() => PostModel)
  @Column
  post_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => UserModel, 'user_id')
  user: UserModel;

  @BelongsTo(() => PostModel, 'post_id')
  post: PostModel;
}

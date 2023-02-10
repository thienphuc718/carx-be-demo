import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { PostCategorySelectedModel } from './PostCategorySelected';
import { PostModel } from './Posts';

@Table({
  modelName: 'post_categories',
})
export class PostCategoryModel extends Model<PostCategoryModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  meta_tag_value: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  schema_value: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @BelongsTo(() => PostCategoryModel, 'parent_id')
  parent: PostCategoryModel;

  @BelongsToMany(() => PostModel, () => PostCategorySelectedModel)
  posts: PostModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

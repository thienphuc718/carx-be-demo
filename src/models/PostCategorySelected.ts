import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { PostCategoryModel } from './PostCategories';
import { PostModel } from './Posts';

@Table({
  modelName: 'posts_categories_selecteds',
})
export class PostCategorySelectedModel extends Model<PostCategorySelectedModel> {
  @ForeignKey(() => PostModel)
  @Column
  post_id: string;

  @ForeignKey(() => PostCategoryModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  category_id: string;

  @BelongsTo(() => PostModel)
  post: PostModel;

  @BelongsTo(() => PostCategoryModel)
  category: PostCategoryModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

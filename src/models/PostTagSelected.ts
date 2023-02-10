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
import { PostModel } from './Posts';
import { PostTagModel } from './PostTags';

@Table({
  modelName: 'posts_tags_selecteds',
})
export class PostTagSelectedModel extends Model<PostTagSelectedModel> {
  @ForeignKey(() => PostModel)
  @Column
  post_id: string;

  @ForeignKey(() => PostTagModel)
  @Column
  tag_id: string;

  @BelongsTo(() => PostModel)
  post: PostModel;

  @BelongsTo(() => PostTagModel)
  tag: PostTagModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { PostTypeEnum, PostVisibilityEnum } from '../modules/posts/enum/PostEnum';
import { CommentModel } from './Comments';
import { LikeModel } from './Likes';
import { PostCategoryModel } from './PostCategories';
import { PostCategorySelectedModel } from './PostCategorySelected';
import { PostTagModel } from './PostTags';
import { PostTagSelectedModel } from './PostTagSelected';
import { SectionPostRelationModel } from './SectionPostRelations';
import { SectionModel } from './Sections';
import { UserModel } from './Users';

@Table({
  modelName: 'posts',
})
export class PostModel extends Model<PostModel> {
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  thumbnail: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  images: string[];

  @Column({
    type: DataType.ENUM('ADMIN_POST', 'USER_POST'),
    defaultValue: PostTypeEnum.USER_POST,
  })
  type: PostTypeEnum;

  @ForeignKey(() => UserModel)
  @Column
  user_id: string;

  @Column({
    type: DataType.STRING,
  })
  slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.ENUM('PUBLIC', 'PRIVATE'),
    defaultValue: PostVisibilityEnum.PUBLIC,
  })
  visibility: PostVisibilityEnum;

  @Column({
    type: DataType.STRING,
  })
  external_link: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  meta_tag_value: string[];

  @Column({
    type: DataType.STRING,
  })
  schema_value: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_top_post: boolean;

  @Column({
    type: DataType.STRING,
  })
  converted_title: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_title: string;

  @BelongsTo(() => UserModel, 'user_id')
  author: UserModel;

  @BelongsToMany(() => PostCategoryModel, () => PostCategorySelectedModel)
  categories: PostCategoryModel[];

  @BelongsToMany(() => PostTagModel, () => PostTagSelectedModel)
  tags: PostTagModel[];

  @BelongsToMany(() => SectionModel, () => SectionPostRelationModel)
  section_posts: SectionPostRelationModel[];

  @HasMany(() => CommentModel, 'post_id')
  comments: CommentModel[];

  @HasMany(() => LikeModel, 'post_id')
  likes: LikeModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  transformToCommunityPostResponse(requesterUserId: string) {
    const postData = JSON.parse(JSON.stringify(this));
    const { likes, comments, converted_title, tsv_converted_title, ...rest } = postData;

    const postLikes = likes.filter((like) => !like.is_deleted);
    const postComments = comments.filter((comment) => !comment.is_deleted);
    const isLiked = postLikes.some((like) => like.user_id === requesterUserId && !like.is_deleted);
    const data = {
      ...rest,
      total_like: postLikes.length,
      total_comment: postComments.length,
      is_liked: isLiked,
    }
    return data;
  }
}
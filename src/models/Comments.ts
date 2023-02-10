import {
    BelongsTo,
    Column,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
    DataType,
    HasMany,
    PrimaryKey,
    ForeignKey
  } from 'sequelize-typescript';
import { UserModel, PostModel } from '.';
  
  @Table({
    modelName: 'comments',
  })
  export class CommentModel extends Model<CommentModel> {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
    })
    id: string;
  
    @ForeignKey(() => UserModel)
    @Column
    user_id: string;
  
    @Column({
      type: DataType.STRING,
    })
    content: string;
  
    @ForeignKey(() => CommentModel)
    @Column
    comment_id: string;
  
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

    @BelongsTo(() => CommentModel, 'comment_id')
    comment: CommentModel;

    @BelongsTo(() => PostModel, 'post_id')
    post: PostModel;

    transformToResponse() {
      try {
        const commentData = JSON.parse(JSON.stringify(this));
        const { is_deleted, ...comment } = commentData
        return comment;
      } catch (error) {
        throw error;
      }
    }
  }
  
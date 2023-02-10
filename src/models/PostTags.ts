import {
    Column,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
    DataType,
    BelongsToMany,
  } from 'sequelize-typescript';
import { PostCategoryModel } from './PostCategories';
import { PostModel } from './Posts';
import { PostTagSelectedModel } from './PostTagSelected';
  
  @Table({
    modelName: 'post_tags',
  })
  export class PostTagModel extends Model<PostTagModel> {
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

    @BelongsToMany(() => PostModel, () => PostTagSelectedModel)
    posts: PostModel[];
  
    @CreatedAt
    created_at: Date;
  
    @UpdatedAt
    updated_at: Date;
  }
  
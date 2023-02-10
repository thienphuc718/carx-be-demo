import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CommentModel, CustomerModel, LikeModel, PostCategorySelectedModel, UserModel } from '../../../../models';
import { PostModel } from '../../../../models';
import { PostTagSelectedModel } from '../../../../models';
import { IPostRepository } from './PostRepositoryInterface';
import {getTextSearchString, removeVietnameseTones} from "../../../../helpers/stringHelper";
import {Op} from "sequelize";

@Injectable()
export class PostRepositoryImplementation implements IPostRepository {
  constructor(
    @InjectModel(PostModel) private postModel: typeof PostModel,
    @InjectModel(PostCategorySelectedModel) private postCategorySelectedModel: typeof PostCategorySelectedModel,
    @InjectModel(PostTagSelectedModel) private postTagSelectedModel: typeof PostTagSelectedModel,
    private sequelize: Sequelize,
  ) {}
  findAll(): Promise<PostModel[]> {
    return this.postModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<PostModel[]> {
    let tsVectorSearchString =  null;
    if (condition.title) {
      tsVectorSearchString = getTextSearchString(condition.title);
      condition.tsv_converted_title = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.title;
    }
    return this.postModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [
        tsVectorSearchString ?
          this.sequelize.literal(`ts_rank(posts.tsv_converted_title, to_tsquery('${tsVectorSearchString}')) desc`)
            :
          ['created_at', 'desc']],
    });
  }
  findOneByCondition(condition: any): Promise<PostModel> {
    return this.postModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  countByCondition(condition: any): Promise<number> {
    let tsVectorSearchString =  null;
    if (condition.title) {
      tsVectorSearchString = getTextSearchString(condition.title);
      condition.tsv_converted_title = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.title;
    }
    return this.postModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string): Promise<PostModel> {
    return this.postModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: UserModel,
          as: 'author',
          attributes: ['id', 'full_name', 'avatar', 'phone_number'],
        },
        {
          model: LikeModel,
          as: 'likes',
          attributes: ['id', 'post_id', 'user_id', 'is_deleted']
        },
        {
          model: CommentModel,
          as: 'comments',
        },
      ]
    });
  }
  create(payload: any): Promise<PostModel> {
    const { category_ids, tag_ids, ...rest } = payload;
    return this.sequelize.transaction(async (t) => {
      const createdPost = await this.postModel.create(rest, { transaction: t });
      if (category_ids && category_ids.length > 0) {
        await this.postCategorySelectedModel.bulkCreate(category_ids.map((categoryId: string) => ({
          post_id: createdPost.id,
          category_id: categoryId
        })), { transaction: t });
      }
      if (tag_ids && tag_ids.length > 0) {
        await this.postTagSelectedModel.bulkCreate(tag_ids.map((tagId: string) => ({
          tag_id: tagId,
          post_id: createdPost.id
        })), { transaction: t });
      }
      return createdPost;
    });
  }
  update(id: string, payload: any): Promise<any> {
    return this.postModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string): void {
    this.postModel.update({ is_deleted: true }, { where: { id: id } });
  }
  findAllByConditionV2(limit: number, offset: number, condition: any): Promise<PostModel[]> {
    return this.postModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: LikeModel,
          as: 'likes',
          attributes: ['id', 'post_id', 'user_id', 'is_deleted']
        },
        {
          model: CommentModel,
          as: 'comments',
        },
        {
          model: UserModel,
          as: 'author',
          attributes: ['full_name', 'avatar', 'id']
        }
      ],
      order: [['updated_at', 'desc']],
    })
  }
}

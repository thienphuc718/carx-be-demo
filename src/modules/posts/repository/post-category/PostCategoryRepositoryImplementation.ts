import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostCategoryModel } from '../../../../models';
import { IPostCategoryRepository } from './PostCategoryRepositoryInterface';

@Injectable()
export class PostCategoryRepositoryImplementation implements IPostCategoryRepository {
  constructor(
    @InjectModel(PostCategoryModel) private postCategoryModel: typeof PostCategoryModel,
  ) {}
  findAll(): Promise<PostCategoryModel[]> {
    return this.postCategoryModel.findAll({
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
  ): Promise<PostCategoryModel[]> {
    return this.postCategoryModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  findOneByCondition(
    condition: any,
  ): Promise<PostCategoryModel> {
    return this.postCategoryModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.postCategoryModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<PostCategoryModel> {
    return this.postCategoryModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<PostCategoryModel> {
    return this.postCategoryModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.postCategoryModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.postCategoryModel.update({ is_deleted: false }, { where: { id: id } });
  }
}

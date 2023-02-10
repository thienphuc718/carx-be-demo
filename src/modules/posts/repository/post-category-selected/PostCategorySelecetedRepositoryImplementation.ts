import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostCategorySelectedModel } from '../../../../models';
import { IPostCategorySelectedRepository } from './PostCategorySelectedRepositoryInterface';

@Injectable()
export class PostCategorySelectedRepositoryImplementation implements IPostCategorySelectedRepository {
  constructor(
    @InjectModel(PostCategorySelectedModel)
    private postCategorySelectedModel: typeof PostCategorySelectedModel,
  ) {}

  create(payload: any): Promise<PostCategorySelectedModel> {
    return this.postCategorySelectedModel.create(payload);
  }

  bulkCreate(payload: Array<any>): Promise<PostCategorySelectedModel[]> {
    return this.postCategorySelectedModel.bulkCreate(payload);
  }

  bulkUpdate(
    condition: Array<string | number>,
    payload: any,
  ): Promise<[nRowsModified: number]> {
    return this.postCategorySelectedModel.update(payload, {
      where: {
        ...condition,
      },
    });
  }
}

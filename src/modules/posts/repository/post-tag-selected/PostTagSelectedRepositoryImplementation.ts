import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostTagSelectedModel } from '../../../../models';
import { IPostTagSelectedRepository } from './PostTagSelectedRepositoryInterface';

@Injectable()
export class PostTagSelectedRepositoryImplementation implements IPostTagSelectedRepository {
  constructor(
    @InjectModel(PostTagSelectedModel)
    private postTagSelectedModel: typeof PostTagSelectedModel,
  ) {}

  create(payload: any): Promise<PostTagSelectedModel> {
    return this.postTagSelectedModel.create(payload);
  }

  bulkCreate(payload: Array<any>): Promise<PostTagSelectedModel[]> {
    return this.postTagSelectedModel.bulkCreate(payload);
  }

  bulkUpdate(condition: Array<string | number>, payload: any): Promise<[nRowsModified: number]> {
    return this.postTagSelectedModel.update(payload, {
      where: {
        ...condition,
      },
    });
  }
}

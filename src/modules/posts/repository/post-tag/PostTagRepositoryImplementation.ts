import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostTagModel } from '../../../../models';
import { IPostTagRepository } from './PostTagRepositoryInterface';

@Injectable()
export class PostTagRepositoryImplementation implements IPostTagRepository {
  constructor(
    @InjectModel(PostTagModel) private postTagModel: typeof PostTagModel,
  ) {}
  findAll(): Promise<PostTagModel[]> {
    return this.postTagModel.findAll({
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
  ): Promise<PostTagModel[]> {
    return this.postTagModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  findOneByCondition(condition: any, ): Promise<PostTagModel> {
    return this.postTagModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.postTagModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<PostTagModel> {
    return this.postTagModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<PostTagModel> {
    return this.postTagModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.postTagModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.postTagModel.update({ is_deleted: false }, { where: { id: id } });
  }
}

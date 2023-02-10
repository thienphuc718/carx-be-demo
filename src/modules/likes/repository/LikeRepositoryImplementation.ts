import { InjectModel } from '@nestjs/sequelize';
import { LikeModel } from '../../../models';
import { ILikeRepository } from './LikeRepositoryInterface';

export class LikeRepositoryImplementation implements ILikeRepository {
  constructor(@InjectModel(LikeModel) private likeModel: typeof LikeModel) {}

  create(payload: any): Promise<LikeModel> {
    return this.likeModel.create(payload);
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<LikeModel[]> {
    return this.likeModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
      },
      order: [['updated_at', 'desc']],
    });
  }
  findOneByCondition(condition: any): Promise<LikeModel> {
    return this.likeModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  update(condition: any, payload: any): Promise<[number, LikeModel[]]> {
    return this.likeModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    });
  }
  count(condition: any): Promise<number> {
    return this.likeModel.count({
      where: {
        ...condition,
      },
    });
  }
  findAllByConditionWithoutPagination(condition: any): Promise<LikeModel[]> {
    return this.likeModel.findAll({
      where: {
        ...condition,
      },
    });
  }
}

import { InjectModel } from '@nestjs/sequelize';
import { RecommendedKeywordModel } from '../../../models';
import { IRecommendedKeywordRepository } from './RecommendedKeywordRepositoryInterface';

export class RecommendedKeywordRepositoryImplementation
  implements IRecommendedKeywordRepository
{
  constructor(
    @InjectModel(RecommendedKeywordModel)
    private recommendedKeywordModel: typeof RecommendedKeywordModel,
  ) {}
  countByCondition(condition: any): Promise<number> {
    return this.recommendedKeywordModel.count({
      where: {
        ...condition,
      },
    });
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<RecommendedKeywordModel[]> {
    return this.recommendedKeywordModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
      },
      order: [['updated_at', 'desc']],
    });
  }
  findById(id: string): Promise<RecommendedKeywordModel> {
    return this.recommendedKeywordModel.findByPk(id);
  }
  create(payload: any): Promise<RecommendedKeywordModel> {
    return this.recommendedKeywordModel.create(payload);
  }
  update(
    id: string,
    payload: any,
  ): Promise<[number, RecommendedKeywordModel[]]> {
    return this.recommendedKeywordModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  delete(id: string): Promise<number> {
    return this.recommendedKeywordModel.destroy({
      where: { id: id },
    });
  }
  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<RecommendedKeywordModel[]> {
    return this.recommendedKeywordModel.findAll({
      ...condition,
    });
  }
  findOneByCondition(condition: any): Promise<RecommendedKeywordModel> {
    return this.recommendedKeywordModel.findOne({
      where: {
        ...condition,
      },
    });
  }
}

import { RecommendedKeywordModel } from '../../../models';

export interface IRecommendedKeywordRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<RecommendedKeywordModel[]>;
  findById(id: string): Promise<RecommendedKeywordModel>;
  create(payload: any): Promise<RecommendedKeywordModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, RecommendedKeywordModel[]]>;
  delete(id: string): Promise<number>;
  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<RecommendedKeywordModel[]>;
  findOneByCondition(condition: any): Promise<RecommendedKeywordModel>;
  countByCondition(condition: any): Promise<number>;
}

export const IRecommendedKeywordRepository = Symbol(
  'IRecommendedKeywordRepository',
);

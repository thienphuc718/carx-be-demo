import { RecommendedKeywordModel } from '../../../models';
import {
  CreateRecommendedKeywordDto,
  FilterRecommendedKeywordDto,
  UpdateRecommendedKeywordDto,
} from '../dto/RecommendedKeywordDto';

export interface IRecommendedKeywordService {
  getRecommendedKeywordListByCondition(
    payload: FilterRecommendedKeywordDto,
  ): Promise<RecommendedKeywordModel[]>;
  getRecommendedKeywordDetail(id: string): Promise<RecommendedKeywordModel>;
  countRecommendedKeywordByCondition(condition: any): Promise<number>;
  getRecommendedKeywordByCondition(
    condition: any,
  ): Promise<RecommendedKeywordModel>;
  getRecommendedKeywordListByCondition(
    condition: any,
  ): Promise<RecommendedKeywordModel[]>;
  updateRecommendedKeyword(
    id: string,
    payload: UpdateRecommendedKeywordDto,
  ): Promise<RecommendedKeywordModel>;
  createRecommendedKeyword(
    payload: CreateRecommendedKeywordDto,
  ): Promise<RecommendedKeywordModel>;
  deleteRecommendedKeyword(id: string): Promise<boolean>;
}

export const IRecommendedKeywordService = Symbol('IRecommendedKeywordService');

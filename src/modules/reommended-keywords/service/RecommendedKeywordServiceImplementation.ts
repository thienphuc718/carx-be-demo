import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { RecommendedKeywordModel } from '../../../models';
import {
  FilterRecommendedKeywordDto,
  UpdateRecommendedKeywordDto,
  CreateRecommendedKeywordDto,
} from '../dto/RecommendedKeywordDto';
import { IRecommendedKeywordRepository } from '../repository/RecommendedKeywordRepositoryInterface';
import { IRecommendedKeywordService } from './RecommendedKeywordServiceInterface';

export class RecommendedKeywordServiceImplementation
  implements IRecommendedKeywordService
{
  constructor(
    @Inject(IRecommendedKeywordRepository)
    private recommendedKeywordRepository: IRecommendedKeywordRepository,
  ) {}

  async getRecommendedKeywordListByCondition(
    payload: FilterRecommendedKeywordDto,
  ): Promise<RecommendedKeywordModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const queryCondition = this.buildSearchQueryCondition(rest);
      const recommendedKeywords =
        await this.recommendedKeywordRepository.findAllByCondition(
          limit,
          (page - 1) * limit,
          queryCondition,
        );
      return recommendedKeywords;
    } catch (error) {
      throw error;
    }
  }
  getRecommendedKeywordDetail(id: string): Promise<RecommendedKeywordModel> {
    return this.recommendedKeywordRepository.findById(id);
  }
  countRecommendedKeywordByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.recommendedKeywordRepository.countByCondition(queryCondition);
  }
  getRecommendedKeywordByCondition(
    condition: any,
  ): Promise<RecommendedKeywordModel> {
    return this.recommendedKeywordRepository.findOneByCondition(condition);
  }
  async updateRecommendedKeyword(
    id: string,
    payload: UpdateRecommendedKeywordDto,
  ): Promise<RecommendedKeywordModel> {
    try {
      const [nModified, keywords] =
        await this.recommendedKeywordRepository.update(id, payload);
      if (!nModified) {
        throw new Error('Cannot update keyword');
      }
      const recommendedKeyword = keywords[0];
      return recommendedKeyword;
    } catch (error) {
      throw error;
    }
  }
  createRecommendedKeyword(
    payload: CreateRecommendedKeywordDto,
  ): Promise<RecommendedKeywordModel> {
    return this.recommendedKeywordRepository.create(payload);
  }
  async deleteRecommendedKeyword(id: string): Promise<boolean> {
    try {
      const recommendedKeyword = await this.getRecommendedKeywordDetail(id);
      if (!recommendedKeyword) {
        throw new Error('Recommended Keyword not found');
      }
      const nDeleted = await this.recommendedKeywordRepository.delete(
        recommendedKeyword.id,
      );
      return !!nDeleted;
    } catch (error) {
      throw error;
    }
  }
  buildSearchQueryCondition(
    condition: Record<string, any>,
  ): Record<string, any> {
    let queryCondition = {
      ...condition,
    };
    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    if (condition.keyword) {
      queryCondition = {
        ...queryCondition,
        keyword: {
          [Op.iLike]: `%${condition.keyword}%`,
        },
      };
    }
    return queryCondition;
  }
}

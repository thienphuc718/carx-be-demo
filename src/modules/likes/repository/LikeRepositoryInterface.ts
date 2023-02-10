import { LikeModel } from '../../../models';

export interface ILikeRepository {
  create(payload: any): Promise<LikeModel>;
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<LikeModel[]>;
  findOneByCondition(condition: any): Promise<LikeModel>;
  update(condition: any, payload: any): Promise<[number, LikeModel[]]>;
  count(condition: any): Promise<number>;
  findAllByConditionWithoutPagination(condition: any): Promise<LikeModel[]>;
}

export const ILikeRepository = Symbol('ILikeRepository');

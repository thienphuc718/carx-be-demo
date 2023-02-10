import { LikeModel } from '../../../models';
import { CreateLikeDto, FilterLikeDto, UpdateLikeDto } from '../dto/LikeDto';

export interface ILikeService {
  createLike(payload: CreateLikeDto): Promise<LikeModel>;
  getLikeListByCondition(payload: FilterLikeDto): Promise<LikeModel[]>;
  getLikeByCondition(condition: any): Promise<LikeModel>;
  updateByCondition(condition: any, payload: any): Promise<boolean>;
  countByCondition(condition: any): Promise<number>;
  getLikeListByConditionWithoutPagination(condition: any): Promise<LikeModel[]>;
}

export const ILikeService = Symbol('ILikeService');

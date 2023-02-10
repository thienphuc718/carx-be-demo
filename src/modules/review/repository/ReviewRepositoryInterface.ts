import { ReviewModel } from '../../../models/Reviews';
import { ReviewDto, UpdateReviewDto } from '../dto/ReviewDto';

export interface IReviewRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ReviewModel[]>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<ReviewModel>;
  create(payload: ReviewDto): Promise<ReviewModel>;
  update(
    id: string,
    payload: UpdateReviewDto,
  ): Promise<[number, ReviewModel[]]>;
}

export const IReviewRepository = Symbol('IReviewRepository');

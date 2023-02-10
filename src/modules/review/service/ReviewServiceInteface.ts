import { ReviewModel } from '../../../models';
import { GetListReviewDto, ReviewDto, UpdateReviewDto } from '../dto/ReviewDto';

export interface IReviewService {
  getListReviews(payload: GetListReviewDto): Promise<[number, ReviewModel[]]>;
  createReview(payload: ReviewDto): Promise<ReviewModel>;
  updateReview(
    id: string,
    payload: UpdateReviewDto,
  ): Promise<[number, ReviewModel[]]>;
}

export const IReviewService = Symbol('IReviewService');

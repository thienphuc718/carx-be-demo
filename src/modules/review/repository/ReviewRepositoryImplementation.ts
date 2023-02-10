import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerModel, ReviewModel } from '../../../models';
import { ReviewDto, UpdateReviewDto } from '../dto/ReviewDto';
import { IReviewRepository } from './ReviewRepositoryInterface';

@Injectable()
export class ReviewRepositoryImplementation implements IReviewRepository {
  constructor(
    @InjectModel(ReviewModel) private reviewModel: typeof ReviewModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ReviewModel[]> {
    return this.reviewModel.findAll({
      limit,
      offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: {
            exclude: [
              'id',
              'user_id',
              'birthday',
              'note',
              'customer_class_id',
              'customer_club_id',
              'tags',
              'created_at',
              'updated_at',
              'city_id',
              'district_id',
            ],
          },
        },
      ],
      order: [['created_at', 'desc']],
    });
  }

  countByCondition(condition: any): Promise<number> {
    return this.reviewModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findById(id: string): Promise<ReviewModel> {
    return this.reviewModel.findByPk(id, {
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: {
            exclude: [
              'id',
              'user_id',
              'birthday',
              'note',
              'customer_class_id',
              'customer_club_id',
              'tags',
              'created_at',
              'updated_at',
              'city_id',
              'district_id',
            ],
          },
        },
      ],
    });
  }

  create(payload: ReviewDto): Promise<ReviewModel> {
    return this.reviewModel.create(payload);
  }

  update(
    id: string,
    payload: UpdateReviewDto,
  ): Promise<[number, ReviewModel[]]> {
    return this.reviewModel.update(payload, { where: { id }, returning: true });
  }
}

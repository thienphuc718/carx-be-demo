import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { calculateDiffDays } from '../../../helpers/datetimeHelper';
import { ReviewModel } from '../../../models/Reviews';
import { IAgentRepository } from '../../agents/repository/AgentRepositoryInterface';
import { ICustomerService } from '../../customers/service/customer/CustomerServiceInterface';
import { NotificationSegmentEnum, NotificationTypeEnum } from '../../notifications/enum/NotificationEnum';
import { INotificationService } from '../../notifications/service/NotificationServiceInterface';
import { IOrderRepository } from '../../orders/repository/order/OrderRepositoryInterface';
import { GetListReviewDto, ReviewDto, UpdateReviewDto } from '../dto/ReviewDto';
import { IReviewRepository } from '../repository/ReviewRepositoryInterface';
import { IReviewService } from './ReviewServiceInteface';
import { IForbiddenKeywordService } from '../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';

@Injectable()
export class ReviewServiceImplementation implements IReviewService {
  constructor(
    @Inject(IReviewRepository) private reviewRepository: IReviewRepository,
    @Inject(IAgentRepository) private agentRepository: IAgentRepository,
    @Inject(IOrderRepository) private orderRepository: IOrderRepository,
    @Inject(INotificationService) private notificationService: INotificationService,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(forwardRef(() => IForbiddenKeywordService))
    private forbiddenKeywordService: IForbiddenKeywordService,
  ) {}

  async getListReviews(
    query: GetListReviewDto,
  ): Promise<[number, ReviewModel[]]> {
    try {
      const { limit, page, ...condition } = query;
      const result = await Promise.all([
        this.countReviews(condition),
        this.reviewRepository.findAllByCondition(limit, (page - 1) * limit, condition),
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async countReviews(condition: any) {
    try {
      const count = await this.reviewRepository.countByCondition(condition);
      return count;
    } catch (error) {
      throw error;
    }
  }

  async createReview(payload: ReviewDto): Promise<ReviewModel> {
    try {
      const { order_id, agent_id, points, customer_id } = payload;
      const [order, agent, customer] = await Promise.all([
        this.orderRepository.findById(order_id),
        this.agentRepository.findOneById(agent_id),
        this.customerService.getCustomerDetail(customer_id, 'public'),
      ]);
      if (!order) {
        throw new Error('There is no order related to this object');
      }
      if (!agent) {
        throw new Error('Agent not found');
      }
      if (!customer) {
        throw new Error('Customer not found');
      }
      if (points < 1) {
        throw new Error('Cannot create review with points less than 1');
      }
      const review = await this.reviewRepository.create(payload);
      if (!review) {
        throw new Error('Cannot create review');
      }
      const checkForbiddenKeyword = await this.forbiddenKeywordService.checkKeywordsExist([
        payload.content,
      ]);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      const { rating_points, count_review } = JSON.parse(JSON.stringify(agent));
      const averagePoints = Number(
        (Number(rating_points) + points) / (count_review + 1),
      );
      const updateAgentPayload = {
        rating_points: Number(averagePoints.toFixed(6)),
        count_review: count_review + 1,
      };
      await this.agentRepository.update(agent_id, updateAgentPayload);
      if (order.booking) {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: agent.user_id,
            message: `Khách hàng ${customer.full_name || customer.phone_number } đã đánh giá đơn hàng dịch vụ #${order.booking.booking_no}`,
            heading: `Đơn hàng dịch vụ #${order.booking.booking_no}`,
            targetGroup: NotificationSegmentEnum.AGENT,
            data: { booking_id: order.booking.id },
            type: NotificationTypeEnum.CUSTOMER_REVIEW_BOOKING,
            image: customer.avatar ?? null,
          }
        );
      } else {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: agent.user_id,
            message: `Khách hàng ${customer.full_name || customer.phone_number } đã đánh giá đơn hàng sản phẩm #${order.order_no}`,
            heading: `Đơn hàng #${order.order_no}`,
            targetGroup: NotificationSegmentEnum.AGENT,
            data: { order_id: order.id },
            type: NotificationTypeEnum.CUSTOMER_REVIEW_ORDER,
            image: customer.avatar ?? null,
          }
        );
      }
      return review;
    } catch (error) {
      throw error;
    }
  }

  async updateReview(
    id: string,
    payload: UpdateReviewDto,
  ): Promise<[number, ReviewModel[]]> {
    try {
      const review = await this.reviewRepository.findById(id);
      const agent = await this.agentRepository.findOneById(review.agent_id);
      if (!review || !agent) {
        throw new Error('Review does not exist');
      }
      const diffDays = calculateDiffDays(
        new Date(),
        new Date(review.createdAt),
      );
      if (diffDays > 4) {
        throw new Error('Cannot update reviews created more than 3 days');
      }

      // re-calculate agent's rating_points if customer update review points
      const isUpdatePoints = Number(payload.points) !== Number(review.points);
      let newAveragePoints = agent.rating_points;
      if (isUpdatePoints) {
        const { rating_points: curAveragePoints, count_review } = JSON.parse(
          JSON.stringify(agent),
        );
        const oldReviewPoints = review.points;
        const oldAveragePoints = Number(
          Number(curAveragePoints) * count_review - oldReviewPoints,
        );
        newAveragePoints = (oldAveragePoints + payload.points) / count_review;
      }

      const [updatedReview] = await Promise.all([
        this.reviewRepository.update(id, payload),
        isUpdatePoints &&
          this.agentRepository.update(agent.id, {
            rating_points: newAveragePoints,
          }),
      ]);
      return updatedReview;
    } catch (error) {
      throw error;
    }
  }
}

import { Inject } from '@nestjs/common';
import { LikeModel } from '../../../models';
import { ActivityCodeEnum } from '../../activities/enum/ActivityEnum';
import { IActivityService } from '../../activities/service/ActivityServiceInteface';
import { NotificationSegmentEnum , NotificationTypeEnum } from '../../notifications/enum/NotificationEnum';
import { INotificationService } from '../../notifications/service/NotificationServiceInterface';
import { IPostService } from '../../posts/service/post/PostServiceInterface';
import { IUserService } from '../../users/service/UserServiceInterface';
import { CreateLikeDto , FilterLikeDto } from '../dto/LikeDto';
import { ILikeRepository } from '../repository/LikeRepositoryInterface';
import { ILikeService } from './LikeServiceInterface';

export class LikeServiceImplementation implements ILikeService {
  constructor(
    @Inject(ILikeRepository) private likeRepository: ILikeRepository,
    @Inject(IUserService) private userService: IUserService,
    @Inject(IPostService) private postService: IPostService,
    @Inject(IActivityService) private activityService: IActivityService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
  ) {}

  async createLike(payload: CreateLikeDto): Promise<LikeModel> {
    const post = await this.postService.getPostDetail(payload.post_id);
    if (!post) {
      throw new Error('Post not found');
    }
    const user = await this.userService.getUserDetail(
      payload.user_id,
      'public',
    );
    if (!user) {
      throw new Error('User not found');
    }
    const params: Record<string, any> = {
      ...payload,
    };

    const createdRecord = await this.getLikeByCondition({
      user_id: user.id,
      post_id: post.id,
    });
    if (createdRecord) {
      createdRecord.is_deleted = false;
      return createdRecord.save();
    } else {
      const createdLike = await this.likeRepository.create(params);
      // CREATE ACTIVITY
      await this.activityService.createActivity({
        code: ActivityCodeEnum.LIKE,
        entity_id: createdLike.id,
        entity_name: 'likes',
        user_id: user.id,
        data: { post_id: payload.post_id },
      });

      if (post.user_id !== user.id) {
        // SEND NOTIFICATION
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: post.user_id,
            message: `${user.full_name || user.phone_number} đã thích bài viết của bạn`,
            heading: `${post.title}` || 'CarX',
            targetGroup: user.customer_details ? NotificationSegmentEnum.CUSTOMER : NotificationSegmentEnum.AGENT,
            data: { post_id: post.id },
            type: NotificationTypeEnum.USER_LIKE_POST,
            image: user.customer_details.avatar ?? user.agent_details.avatar,
          }
        );
      }
      return createdLike;
    }
  }

  async getLikeListByCondition(payload: FilterLikeDto): Promise<LikeModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const likes = await this.likeRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        rest,
      );
      return likes;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  getLikeByCondition(condition: any): Promise<LikeModel> {
    return this.likeRepository.findOneByCondition(condition);
  }
  async updateByCondition(condition: any, payload: any): Promise<boolean> {
    try {
      const like = await this.getLikeByCondition(condition);
      if (!like) {
        throw new Error('Cannot find like activity');
      }
      const [nModified, _] = await this.likeRepository.update(
        condition,
        payload,
      );
      return !!nModified;
    } catch (error) {
      throw error;
    }
  }
  countByCondition(condition: any): Promise<number> {
    return this.likeRepository.count(condition);
  }
  getLikeListByConditionWithoutPagination(
    condition: any,
  ): Promise<LikeModel[]> {
    return this.likeRepository.findAllByConditionWithoutPagination(condition);
  }
}

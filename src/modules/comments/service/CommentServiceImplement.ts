import {Inject, Injectable} from '@nestjs/common';
import {CommentModel} from '../../../models/Comments';

import {CreateCommentPayloadDto, FilterCommentDto} from '../dto/CommentDto';
import {ICommentRepository} from '../repository/CommentRepositoryInterface';
import {ICommentService} from './CommentServiceInterface';
import {v4 as uuidv4} from 'uuid';
import {IActivityService} from '../../activities/service/ActivityServiceInteface';
import {ActivityCodeEnum} from '../../activities/enum/ActivityEnum';
import {IPostService} from '../../posts/service/post/PostServiceInterface';
import {INotificationService} from '../../notifications/service/NotificationServiceInterface';
import {IForbiddenKeywordService} from '../../forbidden-keywords/service/ForbiddenKeywordServiceInterface'
import {NotificationSegmentEnum, NotificationTypeEnum,} from '../../notifications/enum/NotificationEnum';
import {IUserService} from '../../users/service/UserServiceInterface';

@Injectable()
export class CommentServiceImplementation implements ICommentService {
  constructor(
    @Inject(ICommentRepository)
    private commentRepository: ICommentRepository,
    @Inject(IActivityService) private activityService: IActivityService,
    @Inject(IPostService) private postService: IPostService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(IUserService) private userService: IUserService,
    @Inject(IForbiddenKeywordService)
    private forbiddenKeywordService: IForbiddenKeywordService,
  ) {}

  async createComment(payload: CreateCommentPayloadDto): Promise<CommentModel> {
    try {
      const post = await this.postService.getPostDetail(payload.post_id);
      if (!post) {
        throw new Error('Post not found');
      }
      const commentUser = await this.userService.getUserDetail(
        payload.user_id,
        'public',
      );
      if (!commentUser) {
        throw new Error('User not found');
      }
      const postUser = post.author;
      const checkForbiddenKeywords = await this.forbiddenKeywordService.checkKeywordExist(payload.content);
      if (checkForbiddenKeywords) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeywords,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      const params = {
        id: uuidv4(),
        ...payload,
      }
      
      const createdComment = await this.commentRepository.create(params);
      // CREATE ACTIVITY
      await this.activityService.createActivity({
        user_id: commentUser.id,
        entity_id: createdComment.id,
        entity_name: 'comments',
        code: ActivityCodeEnum.COMMENT,
        data: {
          post_id: payload.post_id,
        },
      });

      
      // SEND NOTIFICATION
      if (commentUser.id !== postUser.id) {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: postUser.id,
            message: `${commentUser.full_name || commentUser.phone_number} đã bình luận bài viết của bạn`,
            heading: post.title || "CarX",
            targetGroup: NotificationSegmentEnum.CUSTOMER,
            data: { post_id: post.id, },
            type: NotificationTypeEnum.USER_COMMENT_POST,
            image: commentUser.avatar,
          }
        );
      }
      return this.commentRepository.findById(createdComment.id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getCommentListByCondition(payload: FilterCommentDto): Promise<CommentModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      return this.commentRepository.findAllByCondition(limit, (page - 1) * limit, rest);
    } catch (error) {
      throw error;
    }
  }

  countCommentByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.commentRepository.count(rest);
  }
}

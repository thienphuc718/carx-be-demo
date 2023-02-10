import { Inject, forwardRef } from '@nestjs/common';
import { PostModel } from '../../../../models';
import {
  FilterPostDto,
  CreatePostDto,
  UpdatePostDto,
  FilterCommunityPostDto,
} from '../../dto/PostDto';
import { IPostRepository } from '../../repository/post/PostRepositoryInterface';
import { IPostService } from './PostServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import {generateSlug, removeVietnameseTones} from '../../../../helpers/stringHelper';
import { IUserService } from '../../../users/service/UserServiceInterface';
import { IActivityService } from '../../../activities/service/ActivityServiceInteface';
import { ActivityCodeEnum } from '../../../activities/enum/ActivityEnum';
import { PostTypeEnum } from '../../enum/PostEnum';
import { IForbiddenKeywordService } from '../../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import { Op } from 'sequelize';
import {
  ISectionPostRelationService
} from "../../../sections/section-post-relation/service/SectionPostRelationServiceInterface";

export class PostServiceImplementation implements IPostService {
  constructor(
    @Inject(IPostRepository) private postRepository: IPostRepository,
    @Inject(forwardRef(() => IUserService)) private userService: IUserService,
    @Inject(IActivityService) private activityService: IActivityService,
    @Inject(IForbiddenKeywordService)
    private forbiddenKeywordService: IForbiddenKeywordService,
    @Inject(forwardRef(() => ISectionPostRelationService)) private sectionPostService: ISectionPostRelationService,
  ) {}

  async getPostList(payload: FilterPostDto): Promise<PostModel[]> {
    const { limit, page, ...rest } = payload;
    const queryCondition = this.buildSearchQueryCondition(rest);
    const posts = await this.postRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      queryCondition,
    );
    return posts;
  }
  getPostByCondition(condition: any): Promise<PostModel> {
    return this.postRepository.findOneByCondition(condition);
  }
  countPostByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.postRepository.countByCondition(queryCondition);
  }
  getPostDetail(id: string): Promise<PostModel> {
    return this.postRepository.findById(id);
  }
  async createPost(payload: CreatePostDto): Promise<PostModel> {
    let params: Record<string, any> = {
      id: uuidv4(),
      ...payload,
    };
    if (payload.title) {
      params = {
        ...params,
        slug: generateSlug(payload.title),
        converted_title: removeVietnameseTones(payload.title).split(' ').filter(item => item !== "").join(' '),
      };
    }
    const user = await this.userService.getUserDetail(
      payload.user_id,
      'public',
    );
    if (!user) {
      throw new Error(`User not found`);
    }
    const checkForbiddenKeywords = await this.forbiddenKeywordService.checkKeywordsExist([
      payload.title,
      payload.content
    ]);
    if (checkForbiddenKeywords) {
      let data = {
        message: 'Forbidden keywords exists',
        value: checkForbiddenKeywords,
        code: 'FORBIDDEN_KEYWORD_ERROR'
      }
      throw data;
    }
    const createdPost = await this.postRepository.create(params);
    await this.activityService.createActivity({
      code: ActivityCodeEnum.CREATE_POST,
      entity_id: createdPost.id,
      entity_name: 'posts',
      user_id: user.id,
    });
    return createdPost;
  }

  async updatePost(id: string, payload: UpdatePostDto): Promise<number> {
    let params: Record<string, any> = {
      ...payload,
    };
    if (payload.title) {
      params = {
        ...params,
        slug: generateSlug(payload.title),
        converted_title: removeVietnameseTones(payload.title).split(' ').filter(item => item !== "").join(' '),
      };
    }
    const checkForbiddenKeywords = await this.forbiddenKeywordService.checkKeywordsExist([
      payload.title,
      payload.content
    ]);
    if (checkForbiddenKeywords) {
      let data = {
        message: 'Forbidden keywords exists',
        value: checkForbiddenKeywords,
        code: 'FORBIDDEN_KEYWORD_ERROR'
      }
      throw data;
    }
    const updatedPost = await this.postRepository.update(id, params);
    return updatedPost;
  }
  async deletePost(id: string): Promise<void> {
    try {
      const post = await this.getPostDetail(id);
      if (!post) {
        throw new Error('Post not found');
      }
      const sectionPost = await this.sectionPostService.getDetailByCondition({
        post_id: post.id
      })
      if (sectionPost) {
        await this.sectionPostService.deleteByCondition({
          post_id: post.id,
          section_id: sectionPost.section_id,
        });
      }
      this.postRepository.delete(id);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
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
    return queryCondition;
  }

  async getCommunityPostList(
    payload: FilterCommunityPostDto,
    userId: string,
  ): Promise<Array<PostModel>> {
    try {
      const { limit, page, ...rest } = payload;
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) {
        throw new Error(`User not found`);
      }
      const queryCondition = this.buildSearchQueryCondition({
        ...rest,
        type: PostTypeEnum.USER_POST,
      })
      const posts = await this.postRepository.findAllByConditionV2(
        limit,
        (page - 1) * limit,
        queryCondition
      );
      return posts;
    } catch (error) {
      throw error;
    }
  }
}

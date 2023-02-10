import { Inject } from '@nestjs/common';
import { PostCategoryModel } from '../../../../models';
import {
  FilterPostCategoryDto,
  CreatePostCategoryDto,
  UpdatePostCategoryDto,
} from '../../dto/PostCategoryDto';
import { IPostCategoryRepository } from '../../repository/post-category/PostCategoryRepositoryInterface';
import { IPostCategoryService } from './PostCategoryServiceInterface';
import { v4 as uuidv4 } from 'uuid';

export class PostCategoryServiceImplementation implements IPostCategoryService {
  constructor(
    @Inject(IPostCategoryRepository)
    private readonly postCategoryRepository: IPostCategoryRepository,
  ) {}

  async getPostCategoryList(
    payload: FilterPostCategoryDto,
  ): Promise<PostCategoryModel[]> {
    const { limit, page } = payload;
    const postCategories = await this.postCategoryRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
    );
    return postCategories;
  }
  getPostCategoryByCondition(condition: any): Promise<PostCategoryModel> {
    return this.postCategoryRepository.findOneByCondition(condition);
  }
  countPostCategoryByCondition(condition: any): Promise<number> {
    return this.postCategoryRepository.countByCondition(condition);
  }
  getPostCategoryDetail(id: string): Promise<PostCategoryModel> {
    return this.postCategoryRepository.findById(id);
  }
  async createPostCategory(payload: CreatePostCategoryDto): Promise<PostCategoryModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload
    };
    const createdPostCategory = await this.postCategoryRepository.create(params);
    return createdPostCategory;
  }
  async updatePostCategory(id: string, payload: UpdatePostCategoryDto): Promise<number> {
    const updatedPostCategory = await this.postCategoryRepository.update(
      id,
      payload,
    );
    return updatedPostCategory;
  }
  async deletePostCategory(id: string): Promise<void> {
    const postCategory = await this.getPostCategoryDetail(id);
    if (!postCategory) {
      throw new Error('Post Category not found');
    }
    this.postCategoryRepository.delete(id);
  }
}

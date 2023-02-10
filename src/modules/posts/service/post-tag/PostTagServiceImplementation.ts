import { Inject } from '@nestjs/common';
import { PostTagModel } from '../../../../models';
import {
  FilterPostTagDto,
  CreatePostTagDto,
  UpdatePostTagDto,
} from '../../dto/PostTagDto';
import { IPostTagRepository } from '../../repository/post-tag/PostTagRepositoryInterface';
import { IPostTagService } from './PostTagServiceInterface';
import { v4 as uuidv4 } from 'uuid';
export class PostTagServiceImplementation implements IPostTagService {
  constructor(
    @Inject(IPostTagRepository) private postTagRepository: IPostTagRepository,
  ) {}

  async getPostTagList(payload: FilterPostTagDto): Promise<PostTagModel[]> {
    const { limit, page } = payload;
    const postTags = await this.postTagRepository.findAllByCondition(limit, (page - 1) * limit, {});
    return postTags;
  }
  
  getPostTagByCondition(condition: any): Promise<PostTagModel> {
    return this.postTagRepository.findOneByCondition(condition);
  }
  
  countPostTagByCondition(condition: any): Promise<number> {
    return this.postTagRepository.countByCondition(condition);
  }
  getPostTagDetail(id: string): Promise<PostTagModel> {
    return this.postTagRepository.findById(id);
  }
  async createPostTag(payload: CreatePostTagDto): Promise<PostTagModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload
    };
    const createdPostTag = await this.postTagRepository.create(params);
    return createdPostTag;
  }
  async updatePostTag(id: string, payload: UpdatePostTagDto): Promise<number> {
    const updatedPostTag = await this.postTagRepository.update(id, payload);
    return updatedPostTag;
  }

  async deletePostTag(id: string): Promise<void> {
    const postTag = await this.getPostTagDetail(id);
    if (!postTag) {
        throw new Error('Post Tag not found');
    }
    this.postTagRepository.delete(id);
  }
}

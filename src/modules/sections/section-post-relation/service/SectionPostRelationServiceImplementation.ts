import { forwardRef, Inject } from '@nestjs/common';
import { SectionPostRelationModel } from '../../../../models';
import { PostVisibilityEnum } from '../../../posts/enum/PostEnum';
import { IPostService } from '../../../posts/service/post/PostServiceInterface';
import { SectionTypeEnum } from '../../enums/SectionEnum';
import { ISectionService } from '../../sections/service/SectionServiceInterface';
import {
  CreateSectionPostRelationPayloadDto,
  UpdateSectionPostRelationPayloadDto,
} from '../dto/SectionPostRelationDto';
import { ISectionPostRelationRepository } from '../repository/SectionPostRelationRepositoryInterface';
import { SectionPostRelationQueryConditionType } from '../type/SectionPostRelationType';
import { ISectionPostRelationService } from './SectionPostRelationServiceInterface';

export class SectionPostRelationServiceImplementation
  implements ISectionPostRelationService
{
  constructor(
    @Inject(ISectionPostRelationRepository)
    private sectionPostRelationRepository: ISectionPostRelationRepository,
    @Inject(forwardRef(() => IPostService)) private postService: IPostService,
    @Inject(forwardRef(() => ISectionService))
    private sectionService: ISectionService,
  ) {}
  getAllByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel[]> {
    return this.sectionPostRelationRepository.findAllByCondition(condition);
  }
  getDetailByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel> {
    return this.sectionPostRelationRepository.findOneByCondition(condition);
  }
  async create(
    payload: CreateSectionPostRelationPayloadDto,
  ): Promise<SectionPostRelationModel> {
    try {
      const { post_id, section_id } = payload;
      const nExistedItem = await this.countByCondition({
        section_id: section_id,
      });
      if (nExistedItem >= 10) {
        throw new Error('Maximum capacity reached');
      }
      const post = await this.postService.getPostDetail(post_id);
      if (!post) {
        throw new Error('Post not found');
      }
      if (post.visibility === PostVisibilityEnum.PRIVATE) {
        throw new Error('Post is currently in private visibility');
      }
      const section = await this.sectionService.getSectionDetailByCondition({ id : section_id});
      if (!section) {
        throw new Error('Section not found');
      }
      const existedItem = await this.sectionPostRelationRepository.findOneByCondition({
        section_id: section.id,
        post_id: post.id,
      });
      if (existedItem) {
        throw new Error('Section Post Item already exists');
      }
      if (section.type !== SectionTypeEnum.TOP_POST) {
        throw new Error('Invalid section type');
      }
      await post.update({ is_top_post: true });
      return this.sectionPostRelationRepository.create({
        post_id: post.id,
        section_id: section.id,
      });
    } catch (error) {
      throw error;
    }
  }
  async updateByCondition(
    condition: SectionPostRelationQueryConditionType,
    payload: UpdateSectionPostRelationPayloadDto,
  ): Promise<SectionPostRelationModel> {
    try {
      const { new_order } = payload;
      const existedItem =
        await this.sectionPostRelationRepository.findOneByCondition(condition);
      if (!existedItem) {
        throw new Error('Section Post Item not found');
      }
      const orderPlacedItem =
        await this.sectionPostRelationRepository.findOneByCondition({
          order: new_order
        });
      if (orderPlacedItem) {
        await orderPlacedItem.update({ order: existedItem.order });
      }
      const [nModified, items] =
        await this.sectionPostRelationRepository.updateByCondition(condition, {
          order: new_order,
        });
      if (!nModified) {
        throw new Error('Cannot update Section Post Item');
      }
      const updatedItem = items[0];
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }
  async deleteByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<boolean> {
    try {
      const post = await this.postService.getPostByCondition({ id: condition.post_id });
      if (!post) {
        throw new Error('Post not found');
      }
      const item = await this.sectionPostRelationRepository.findOneByCondition(
        condition,
      );
      if (!item) {
        throw new Error('Section Post Item not found');
      }
      await post.update({ is_top_post: false });
      const nDeleted =
        await this.sectionPostRelationRepository.deleteByCondition(condition);
      return !!nDeleted;
    } catch (error) {
      throw error;
    }
  }
  countByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.sectionPostRelationRepository.countByCondition(rest);
  }
}

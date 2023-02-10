import { forwardRef, Inject } from '@nestjs/common';
import { SectionPromotionRelationModel } from '../../../../models';
import { IPromotionService } from '../../../promotions/service/promotion/PromotionServiceInterface';
import { SectionTypeEnum } from '../../enums/SectionEnum';
import { ISectionService } from '../../sections/service/SectionServiceInterface';
import {
  CreateSectionPromotionRelationPayloadDto,
  UpdateSectionPromotionRelationPayloadDto,
} from '../dto/SectionPromotionRelationDto';
import { ISectionPromotionRelationRepository } from '../repository/SectionPromotionRelationRepositoryInterface';
import { SectionPromotionRelationQueryConditionType } from '../type/SectionPromotionRelationType';
import { ISectionPromotionRelationService } from './SectionPromotionRelationServiceInterface';

export class SectionPromotionRelationServiceImplementation
  implements ISectionPromotionRelationService
{
  constructor(
    @Inject(ISectionPromotionRelationRepository)
    private sectionPromotionRelationRepository: ISectionPromotionRelationRepository,
    @Inject(IPromotionService) private promotionService: IPromotionService,
    @Inject(forwardRef(() => ISectionService))
    private sectionService: ISectionService,
  ) {}
  getAllByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel[]> {
    try {
      return this.sectionPromotionRelationRepository.findAllByCondition(
        condition,
      );
    } catch (error) {
      throw error;
    }
  }
  getDetailByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel> {
    return this.sectionPromotionRelationRepository.findOneByCondition(
      condition,
    );
  }
  async create(
    payload: CreateSectionPromotionRelationPayloadDto,
  ): Promise<SectionPromotionRelationModel> {
    try {
      const { promotion_id, section_id } = payload;
      const promotion = await this.promotionService.getPromotionDetail(
        promotion_id,
      );
      if (!promotion) {
        throw new Error('Promotion not found');
      }
      const section = await this.sectionService.getSectionDetailByCondition({ id: section_id });
      if (!section) {
        throw new Error('Section not found');
      }
      if (section.type !== SectionTypeEnum.PROMOTION) {
        throw new Error('Invalid section type');
      }
      const nExistedItem = await this.countByCondition({
        section_id: section_id,
      });
      if (nExistedItem >= 20) {
        throw new Error('Maximum capacity reached');
      }
      const existedItem = await this.getDetailByCondition({
        section_id: section.id,
        promotion_id: promotion.id,
      });
      if (existedItem) {
        throw new Error('Section Promotion Item already exists');
      }
      return this.sectionPromotionRelationRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }
  async updateByCondition(
    condition: SectionPromotionRelationQueryConditionType,
    payload: UpdateSectionPromotionRelationPayloadDto,
  ): Promise<SectionPromotionRelationModel> {
    try {
      const { new_order } = payload;
      const existedItem = await this.getDetailByCondition(condition);
      if (!existedItem) {
        throw new Error('Section Promotion Item not found');
      }
      const orderPlacedItem =
        await this.sectionPromotionRelationRepository.findOneByCondition({
          order: new_order,
        });
      if (orderPlacedItem) {
        await orderPlacedItem.update({ order: existedItem.order });
      }
      const [nModified, items] =
        await this.sectionPromotionRelationRepository.updateByCondition(
          condition,
          { order: new_order },
        );
      if (!nModified) {
        throw new Error('Cannot update order');
      }
      const updatedItem = items[0];
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }
  async deleteByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<boolean> {
    try {
      const item = await this.getDetailByCondition(condition);
      if (!item) {
        throw new Error('Section Promotion Item not found');
      }
      const nModified =
        await this.sectionPromotionRelationRepository.deleteByCondition(
          condition,
        );
      return !!nModified;
    } catch (error) {
      throw error;
    }
  }
  countByCondition(condition: any): Promise<number> {
    return this.sectionPromotionRelationRepository.countByCondition(condition);
  }
}

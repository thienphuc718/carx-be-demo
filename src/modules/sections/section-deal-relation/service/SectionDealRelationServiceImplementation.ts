import { forwardRef, Inject } from '@nestjs/common';
import { SectionDealRelationModel } from '../../../../models';
import { IDealService } from '../../../deals/service/DealServiceInterface';
import { SectionTypeEnum } from '../../enums/SectionEnum';
import { ISectionService } from '../../sections/service/SectionServiceInterface';
import {
  CreateSectionDealRelationPayloadDto,
  UpdateSectionDealRelationPayloadDto,
} from '../dto/SectionDealRelationDto';
import { ISectionDealRelationRepository } from '../repository/SectionDealRelationRepositoryInterface';
import { SectionDealRelationQueryConditionType } from '../type/SectionDealRelationType';
import { ISectionDealRelationService } from './SectionDealRelationServiceInterface';

export class SectionDealRelationServiceImplementation
  implements ISectionDealRelationService
{
  constructor(
    @Inject(ISectionDealRelationRepository)
    private sectionPostRelationRepository: ISectionDealRelationRepository,
    @Inject(forwardRef(() => IDealService)) private dealService: IDealService,
    @Inject(forwardRef(() => ISectionService)) private sectionService: ISectionService
  ) {}
  getListByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<SectionDealRelationModel[]> {
    return this.sectionPostRelationRepository.findAllByCondition(condition);
  }
  getDetailByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<SectionDealRelationModel> {
    return this.sectionPostRelationRepository.findOneByCondition(condition);
  }
  async createSectionDealRelation(
    payload: CreateSectionDealRelationPayloadDto,
  ): Promise<SectionDealRelationModel> {
    try {
      const { deal_id, section_id } = payload;
      const nExistedItem = await this.countByCondition({
        section_id: section_id,
      });
      if (nExistedItem >= 20) {
        throw new Error('Maximum capacity reached');
      }
      const deal = await this.dealService.getDealDetail(deal_id);
      if (!deal) {
        throw new Error('Deal not found')
      }
      const section = await this.sectionService.getSectionDetailByCondition({ id: section_id });
      if (!section) {
        throw new Error('Section not found');
      }
      if (section.type !== SectionTypeEnum.HOT_DEAL) {
        throw new Error('Invalid section type');
      }
      const existedItem = await this.getDetailByCondition(payload);
      if (existedItem) {
        throw new Error('Hot deal existed');
      }
      await deal.update({ is_hot_deal: true });
      return this.sectionPostRelationRepository.create({
        deal_id: deal.id,
        section_id: section.id,
      });
    } catch (error) {
      throw error;
    }
  }
  async updateByCondition(
    condition: SectionDealRelationQueryConditionType,
    payload: UpdateSectionDealRelationPayloadDto,
  ): Promise<SectionDealRelationModel> {
    try {
      const { new_order } = payload;
      const existedItem = await this.getDetailByCondition(condition);
      if (!existedItem) {
        throw new Error('Section Deal item not found');
      }
      const orderPlacedItem =
        await this.sectionPostRelationRepository.findOneByCondition({
          order: new_order,
        });
      if (orderPlacedItem) {
        await orderPlacedItem.update({ order: existedItem.order });
      }
      const [nModified, items] =
        await this.sectionPostRelationRepository.updateByCondition(condition, {
          order: new_order,
        });
      if (!nModified) {
        throw new Error('Cannot update Section Deal Order');
      }
      const updatedItem = items[0];
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }
  async deleteByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<boolean> {
    try {
      const { deal_id, section_id } = condition;
      const item = await this.sectionPostRelationRepository.findOneByCondition(
        condition,
      );
      if (!item) {
        throw new Error('Section Deal Relation not found');
      }
      const deal = await this.dealService.getDealDetail(deal_id);
      if (!deal) {
        throw new Error('Deal not found')
      }
      const section = await this.sectionService.getSectionDetailByCondition({ id : section_id });
      if (!section) {
        throw new Error('Section not found');
      }
      if (section.type !== SectionTypeEnum.HOT_DEAL) {
        throw new Error('Invalid section type');
      }
      await deal.update({ is_hot_deal: false });
      const nDeleted =
        await this.sectionPostRelationRepository.deleteByCondition(condition);
      return !!nDeleted;
    } catch (error) {
      throw error;
    }
  }

  countByCondition(condition: any): Promise<number> {
    return this.sectionPostRelationRepository.countByCondition(condition);
  }
}

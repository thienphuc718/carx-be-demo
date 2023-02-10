import { forwardRef, Inject } from '@nestjs/common';
import { SectionAgentRelationModel } from '../../../../models';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { SectionTypeEnum } from '../../enums/SectionEnum';
import { ISectionService } from '../../sections/service/SectionServiceInterface';
import {
  CreateSectionAgentRelationPayloadDto,
  UpdateSectionAgentRelationPayloadDto,
} from '../dto/SectionAgentRelationDto';
import { ISectionAgentRelationRepository } from '../repository/SectionAgentRelationRepositoryInterface';
import { SectionAgentRelationQueryConditionType } from '../type/SectionAgentRelationType';
import { ISectionAgentRelationService } from './SectionAgentRelationServiceInterface';

export class SectionAgentRelationServiceImplementation
  implements ISectionAgentRelationService
{
  constructor(
    @Inject(ISectionAgentRelationRepository)
    private sectionAgentRelationRepository: ISectionAgentRelationRepository,
    @Inject(forwardRef(() => IAgentService)) private agentService: IAgentService,
    @Inject(forwardRef(() => ISectionService))
    private sectionService: ISectionService,
  ) {}
  async create(
    payload: CreateSectionAgentRelationPayloadDto,
  ): Promise<SectionAgentRelationModel> {
    try {
      const { section_id, agent_id } = payload;
      const section = await this.sectionService.getSectionDetailByCondition({ id: section_id });
      if (!section) {
        throw new Error('Section not found');
      }
      const nExistedItem = await this.countByCondition({
        section_id: section_id,
      });
      if (nExistedItem >= 20) {
        throw new Error('Maximum capacity reached');
      }
      const agent = await this.agentService.getAgentDetails(agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const existedItem = await this.getDetailByCondition(payload);
      if (existedItem) {
        throw new Error('Section Agent Item already exists');
      }
      if (section.type === SectionTypeEnum.AUTHENTIC_AGENT) {
        await agent.update({ authentic_agent: true });
      } else if (section.type === SectionTypeEnum.TOP_AGENT) {
        await agent.update({ top_agent: true });
      } else {
        throw new Error('Invalid section type');
      }
      return this.sectionAgentRelationRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }
  getDetailByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<SectionAgentRelationModel> {
    return this.sectionAgentRelationRepository.findOneByCondition(condition);
  }
  getAllByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<SectionAgentRelationModel[]> {
    try {
      return this.sectionAgentRelationRepository.findAllByCondition(condition);
    } catch (error) {
      throw error;
    }
  }
  async updateByCondition(
    condition: SectionAgentRelationQueryConditionType,
    payload: UpdateSectionAgentRelationPayloadDto,
  ): Promise<SectionAgentRelationModel> {
    try {
      const { new_order } = payload;
      const existedItem = await this.getDetailByCondition(condition);
      if (!existedItem) {
        throw new Error('Section Agent item not found');
      }
      const orderPlacedItem =
        await this.sectionAgentRelationRepository.findOneByCondition({
          order: new_order,
        });
      if (orderPlacedItem) {
        await orderPlacedItem.update({ order: existedItem.order });
      }
      const [nModified, items] =
        await this.sectionAgentRelationRepository.updateByCondition(condition, {
          order: new_order,
        });
      if (!nModified) {
        throw new Error('Cannot update Section Agent Order');
      }
      const updatedItem = items[0];
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }
  async deleteByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<boolean> {
    try {
      const section = await this.sectionService.getSectionDetailByCondition(
        { id: condition.section_id },
      );
      if (!section) {
        throw new Error('Section not found');
      }
      const agent = await this.agentService.getAgentDetails(condition.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      if (section.type === SectionTypeEnum.AUTHENTIC_AGENT) {
        await agent.update({ authentic_agent: false });
      } else if (section.type === SectionTypeEnum.TOP_AGENT) {
        await agent.update({ top_agent: false });
      } else {
        throw new Error('Invalid section type');
      }
      const item = await this.getDetailByCondition(condition);
      if (!item) {
        throw new Error('Section Agent Item not found');
      }
      const nDeleted =
        await this.sectionAgentRelationRepository.deleteByCondition({
          section_id: section.id,
          agent_id: agent.id,
          order: item.order,
        });
      return !!nDeleted;
    } catch (error) {
      throw error;
    }
  }
  countByCondition(condition: any): Promise<number> {
    return this.sectionAgentRelationRepository.countByCondition(condition);
  }
}

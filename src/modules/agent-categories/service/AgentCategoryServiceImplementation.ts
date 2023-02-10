import { Inject } from '@nestjs/common';
import { generateSlug } from '../../../helpers/stringHelper';
import { AgentCategoryModel } from '../../../models';
import {
  FilterAgentCategoryDto,
  CreateAgentCategoryDto,
  UpdateAgentCategoryDto,
} from '../dto/AgentCategoryDto';
import { IAgentCategoryRepository } from '../repository/AgentCategoryRepositoryInterface';
import { IAgentCategoryService } from './AgentCategoryServiceInterface';

export class AgentCategoryServiceImplementation
  implements IAgentCategoryService
{
  constructor(
    @Inject(IAgentCategoryRepository)
    private agentCategoryRepository: IAgentCategoryRepository,
  ) {}
  async getAgentCategoryList(
    payload: FilterAgentCategoryDto,
  ): Promise<AgentCategoryModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const agentCategories =
        await this.agentCategoryRepository.findAllWithCondition(
          limit,
          (page - 1) * limit,
          rest,
        );
      return agentCategories;
    } catch (error) {
      throw error;
    }
  }

  getAgentCategoryDetail(id: string): Promise<AgentCategoryModel> {
    return this.agentCategoryRepository.findById(id);
  }

  async createAgentCategory(
    payload: CreateAgentCategoryDto,
  ): Promise<AgentCategoryModel> {
    try {
      const params = {
        ...payload,
        slug: generateSlug(payload.name),
      };
      return this.agentCategoryRepository.create(params);
    } catch (error) {
      throw error;
    }
  }

  async updateAgentCategory(
    id: string,
    payload: UpdateAgentCategoryDto,
  ): Promise<AgentCategoryModel> {
    try {
      let params: Record<string, any> = {
        ...payload,
      };
      if (params.name) {
        params = {
          ...params,
          slug: generateSlug(params.name),
        };
      }
      const [nModified, agentCategories] =
        await this.agentCategoryRepository.update(id, params);
      if (!nModified) {
        throw new Error(`Cannot update agent category ${id}`);
      }
      return agentCategories[0];
    } catch (error) {
      throw error;
    }
  }

  async deleteAgentCategory(id: string): Promise<void> {
    const agentCategory = await this.getAgentCategoryDetail(id);
    if (!agentCategory) {
      throw new Error('Agent Category not found');
    }
    this.agentCategoryRepository.delete(id);
  }

  countAgentCategoryByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.agentCategoryRepository.countByCondition(queryCondition);
  }

  getAgentCategoryByCondition(condition: any): Promise<AgentCategoryModel> {
    return this.agentCategoryRepository.findOneByCondition(condition);
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
}

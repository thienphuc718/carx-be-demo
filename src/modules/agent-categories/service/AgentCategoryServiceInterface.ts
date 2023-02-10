import { AgentCategoryModel } from '../../../models';
import {
  CreateAgentCategoryDto,
  FilterAgentCategoryDto,
  UpdateAgentCategoryDto,
} from '../dto/AgentCategoryDto';

export interface IAgentCategoryService {
  getAgentCategoryList(
    payload: FilterAgentCategoryDto,
  ): Promise<AgentCategoryModel[]>;
  getAgentCategoryDetail(id: string): Promise<AgentCategoryModel>;
  createAgentCategory(
    payload: CreateAgentCategoryDto,
  ): Promise<AgentCategoryModel>;
  updateAgentCategory(
    id: string,
    payload: UpdateAgentCategoryDto,
  ): Promise<AgentCategoryModel>;
  deleteAgentCategory(id: string): Promise<void>;
  countAgentCategoryByCondition(condition: any): Promise<number>;
  getAgentCategoryByCondition(condition: any): Promise<AgentCategoryModel>;
}

export const IAgentCategoryService = Symbol('IAgentCategoryService');

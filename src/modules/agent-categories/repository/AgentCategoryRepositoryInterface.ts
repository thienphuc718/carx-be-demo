import { AgentCategoryModel } from '../../../models';

export interface IAgentCategoryRepository {
  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<AgentCategoryModel[]>;
  findById(id: string): Promise<AgentCategoryModel>;
  create(payload: any): Promise<AgentCategoryModel>;
  update(id: string, payload: any): Promise<[number, AgentCategoryModel[]]>;
  countByCondition(condition: any): Promise<number>
  delete(id: string): void;
  findOneByCondition(condition: any): Promise<AgentCategoryModel>
}

export const IAgentCategoryRepository = Symbol('IAgentCategoryRepository');

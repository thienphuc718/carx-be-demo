import { AgentModel } from '../../../models';
import { CreateAgentEntityDto, UpdateAgentEntityDto } from '../dto/AgentDto';

export interface IAgentRepository {
  findOneById(id: string): Promise<AgentModel>;
  create(payload: CreateAgentEntityDto, transaction?: any): Promise<AgentModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, AgentModel[]]>;
  findAll(limit: number, offset: number, condition?: any, order_by?: any, order_type?: any): Promise<AgentModel[]>;
  findAllWithoutPaging(condition?: any): Promise<AgentModel[]>;
  count(condition?: Record<string, any>): Promise<number>;
  getAgentIdsByServiceCategory(categoryId: string): Promise<string[]>
  queryRaw(raw: string);
  whereRaw(limit: number, offset: number, condition?: any, rawCondition?: any): Promise<AgentModel[]>;
  whereRawWithoutPagination(condition: any, rawCondition: any): Promise<AgentModel[]>
  countRaw(condition?: any, rawCondition?: any): any;
  findOneByCondition(condition: any): Promise<AgentModel>
}

export const IAgentRepository = Symbol('IAgentRepository');

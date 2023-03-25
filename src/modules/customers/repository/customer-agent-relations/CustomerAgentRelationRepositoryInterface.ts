import { CustomerAgentRelationsModel } from '../../../../models';

export interface ICustomerAgentRelationRepository {
  findAllByConditionWithPagination(limit: number, offset: number, condition: any): Promise<CustomerAgentRelationsModel[]>
  create(payload: any): Promise<CustomerAgentRelationsModel>;
  bulkCreate(payload: Array<any>): Promise<CustomerAgentRelationsModel[]>;
  countByCondition(condition: any): Promise<number>;
  findAllByConditionWithoutPagination(condition: any): Promise<CustomerAgentRelationsModel[]>;
}

export const ICustomerAgentRelationRepository = Symbol('ICustomerAgentRelationRepository');

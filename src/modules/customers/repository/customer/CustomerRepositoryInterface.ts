import { CustomerModel } from '../../../../models/Customers';

export interface ICustomerRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
    schema?: string,
  ): Promise<CustomerModel[]>;
  countByCondition(condition: any, schema: string): Promise<number>;
  findById(id: string): Promise<CustomerModel>;
  findOneByCondition(condition: any): Promise<CustomerModel>
  create(payload: any, schema: string): Promise<CustomerModel>;
  update(id: string, payload: any): Promise<[number, CustomerModel[]]>;
  delete(id: string): Promise<number>;
  findAllByConditionWithoutPagination(condition: any): Promise<CustomerModel[]>
}

export const ICustomerRepository = Symbol('ICustomerRepository');

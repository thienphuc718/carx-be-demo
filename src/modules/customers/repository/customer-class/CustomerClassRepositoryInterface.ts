import { CustomerClassModel } from '../../../../models/CustomerClasses';

export interface ICustomerClassRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
    schema?: string,
  ): Promise<CustomerClassModel[]>;
  countByCondition(condition: any, schema: string): Promise<number>;
  findById(id: string): Promise<CustomerClassModel>;
  create(payload: any, schema: string): Promise<CustomerClassModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const ICustomerClassRepository = Symbol('ICustomerClassRepository');

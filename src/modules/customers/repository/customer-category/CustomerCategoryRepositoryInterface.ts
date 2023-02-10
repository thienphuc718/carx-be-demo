import { CustomerCategoryModel } from '../../../../models/CustomerCategories';

export interface ICustomerCategoryRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
    schema?: string,
  ): Promise<CustomerCategoryModel[]>;
  countByCondition(condition: any, schema: string): Promise<number>;
  findById(id: string): Promise<CustomerCategoryModel>;
  create(payload: any, schema: string): Promise<CustomerCategoryModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const ICustomerCategoryRepository = Symbol(
  'ICustomerCategoryRepository',
);

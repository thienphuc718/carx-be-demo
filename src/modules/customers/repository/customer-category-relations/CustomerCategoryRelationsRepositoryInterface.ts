import { CustomerCategoryRelationsModel } from '../../../../models/CustomerCategoryRelations';

export interface ICustomerCategoryRelationsRepository {
  create(payload: any): Promise<CustomerCategoryRelationsModel>;
  bulkCreate(payload: Array<any>): Promise<CustomerCategoryRelationsModel[]>;
  bulkUpdate(
    condition: Array<string | number>,
    payload: any,
  ): Promise<[nRowsModified: number]>;
}

export const ICustomerCategoryRelationsRepository = Symbol(
  'ICustomerCategoryRelationsRepository',
);

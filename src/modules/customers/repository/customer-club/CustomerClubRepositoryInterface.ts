import { CustomerClubModel } from '../../../../models/CustomerClubs';

export interface ICustomerClubRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
    schema?: string,
  ): Promise<CustomerClubModel[]>;
  countByCondition(condition: any, schema: string): Promise<number>;
  findById(id: string): Promise<CustomerClubModel>;
  create(payload: any, schema: string): Promise<CustomerClubModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const ICustomerClubRepository = Symbol('ICustomerClubRepository');

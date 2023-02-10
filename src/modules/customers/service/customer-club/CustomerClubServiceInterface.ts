import { CustomerClubModel } from '../../../../models/CustomerClubs';
import {
  CreateCustomerClubDto,
  FilterCustomerClubDto,
  UpdateCustomerClubDto,
} from '../../dto/CustomerClubDto';

export interface ICustomerClubService {
  getCustomerClubList(
    payload: FilterCustomerClubDto,
    schema: string,
  ): Promise<CustomerClubModel[]>;
  countCustomerClubByCondition(condition: any, schema: string): Promise<number>;
  getCustomerClubDetail(id: string, schema: string): Promise<CustomerClubModel>;
  createCustomerClub(
    payload: CreateCustomerClubDto,
    schema: string,
  ): Promise<CustomerClubModel>;
  updateCustomerClub(
    id: string,
    payload: UpdateCustomerClubDto,
    schema: string,
  ): Promise<number>;
  deleteCustomerClub(id: string, schema: string): Promise<void>;
}

export const ICustomerClubService = Symbol('ICustomerClubService');

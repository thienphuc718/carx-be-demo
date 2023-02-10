import { CustomerModel } from '../../../../models/Customers';
import {
  CreateCustomerDto,
  FilterCustomerDto,
  UpdateCustomerDto,
} from '../../dto/CustomerDto';

export interface ICustomerService {
  getCustomerList(
    payload: FilterCustomerDto,
    schema: string,
  ): Promise<CustomerModel[]>;
  countCustomerByCondition(condition: any, schema: string): Promise<number>;
  getCustomerDetail(id: string, schema: string): Promise<CustomerModel>;
  getCustomerDetailByCondition(condition: any, schema: string): Promise<CustomerModel>
  createCustomer(
    payload: CreateCustomerDto,
    schema: string,
  ): Promise<CustomerModel>;
  updateCustomer(
    id: string,
    payload: UpdateCustomerDto,
    schema: string,
  ): Promise<CustomerModel>;
  deleteCustomer(id: string, schema: string): Promise<boolean>;
  addCustomerAgent(customerId: string, agentId: string): Promise<CustomerModel>;
  getCustomerListByConditionWithoutPagination(condition: any) : Promise<CustomerModel[]>
}

export const ICustomerService = Symbol('ICustomerService');

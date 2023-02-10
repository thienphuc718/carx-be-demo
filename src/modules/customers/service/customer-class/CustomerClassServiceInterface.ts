import { CustomerClassModel } from '../../../../models/CustomerClasses';
import {
  CreateCustomerClassDto,
  FilterCustomerClassDto,
  UpdateCustomerClassDto,
} from '../../dto/CustomerClassDto';

export interface ICustomerClassService {
  getCustomerClassList(
    payload: FilterCustomerClassDto,
    schema: string,
  ): Promise<CustomerClassModel[]>;
  countCustomerClassByCondition(
    condition: any,
    schema: string,
  ): Promise<number>;
  getCustomerClassDetail(
    id: string,
    schema: string,
  ): Promise<CustomerClassModel>;
  createCustomerClass(
    payload: CreateCustomerClassDto,
    schema: string,
  ): Promise<CustomerClassModel>;
  updateCustomerClass(
    id: string,
    payload: UpdateCustomerClassDto,
    schema: string,
  ): Promise<number>;
  deleteCustomerClass(id: string, schema: string): Promise<void>;
}

export const ICustomerClassService = Symbol('ICustomerClassService');

import { CustomerCategoryModel } from '../../../../models/CustomerCategories';
import {
  CreateCustomerCategoryDto,
  FilterCustomerCategoryDto,
  UpdateCustomerCategoryDto,
} from '../../dto/CustomerCategoryDto';

export interface ICustomerCategoryService {
  getCustomerCategoryList(
    payload: FilterCustomerCategoryDto,
    schema: string,
  ): Promise<CustomerCategoryModel[]>;
  countCustomerCategoryByCondition(
    condition: any,
    schema: string,
  ): Promise<number>;
  getCustomerCategoryDetail(
    id: string,
    schema: string,
  ): Promise<CustomerCategoryModel>;
  createCustomerCategory(
    payload: CreateCustomerCategoryDto,
    schema: string,
  ): Promise<CustomerCategoryModel>;
  updateCustomerCategory(
    id: string,
    payload: UpdateCustomerCategoryDto,
    schema: string,
  ): Promise<number>;
  deleteCustomerCategory(id: string, schema: string): Promise<void>;
}

export const ICustomerCategoryService = Symbol('ICustomerCategoryService');

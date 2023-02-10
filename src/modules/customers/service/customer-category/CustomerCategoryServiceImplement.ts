import { v4 as uuidv4 } from 'uuid';
import {
  CreateCustomerCategoryDto,
  FilterCustomerCategoryDto,
  UpdateCustomerCategoryDto,
} from '../../dto/CustomerCategoryDto';
import { Inject, Injectable } from '@nestjs/common';
import { ICustomerCategoryRepository } from '../../repository/customer-category/CustomerCategoryRepositoryInterface';
import { ICustomerCategoryService } from './CustomerCategoryServiceInterface';
import { CustomerCategoryModel } from '../../../../models/CustomerCategories';

@Injectable()
export class CustomerCategoryServiceImplementation
  implements ICustomerCategoryService
{
  constructor(
    @Inject(ICustomerCategoryRepository)
    private cityRepository: ICustomerCategoryRepository,
  ) {}

  async createCustomerCategory(
    payload: CreateCustomerCategoryDto,
    schema: string,
  ): Promise<CustomerCategoryModel> {
    try {
      const city = await this.cityRepository.create(
        { ...payload, id: uuidv4() },
        schema,
      );
      return city;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerCategoryList(
    payload: FilterCustomerCategoryDto,
    schema: string,
  ): Promise<CustomerCategoryModel[]> {
    const { limit, page, ...rest } = payload;
    const customerCategorys = await this.cityRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      rest,
      schema,
    );
    return customerCategorys;
  }

  getCustomerCategoryDetail(
    id: string,
    schema: string,
  ): Promise<CustomerCategoryModel> {
    return this.cityRepository.findById(id);
  }

  countCustomerCategoryByCondition(
    condition: any,
    schema: string,
  ): Promise<number> {
    return this.cityRepository.countByCondition(condition, schema);
  }

  async updateCustomerCategory(
    id: string,
    payload: UpdateCustomerCategoryDto,
  ): Promise<number> {
    try {
      const updatedProduct = await this.cityRepository.update(id, payload);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteCustomerCategory(id: string): Promise<void> {
    return await this.cityRepository.delete(id);
  }
}

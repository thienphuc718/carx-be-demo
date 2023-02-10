import { v4 as uuidv4 } from 'uuid';
import {
  CreateCustomerClassDto,
  FilterCustomerClassDto,
  UpdateCustomerClassDto,
} from '../../dto/CustomerClassDto';
import { Inject, Injectable } from '@nestjs/common';
import { ICustomerClassRepository } from '../../repository/customer-class/CustomerClassRepositoryInterface';
import { ICustomerClassService } from './CustomerClassServiceInterface';
import { CustomerClassModel } from '../../../../models/CustomerClasses';

@Injectable()
export class CustomerClassServiceImplementation
  implements ICustomerClassService
{
  constructor(
    @Inject(ICustomerClassRepository)
    private customerClassRepository: ICustomerClassRepository,
  ) {}

  async createCustomerClass(
    payload: CreateCustomerClassDto,
    schema: string,
  ): Promise<CustomerClassModel> {
    try {
      const customerClass = await this.customerClassRepository.create(
        { ...payload, id: uuidv4() },
        schema,
      );
      return customerClass;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerClassList(
    payload: FilterCustomerClassDto,
    schema: string,
  ): Promise<CustomerClassModel[]> {
    const { limit, page, ...rest } = payload;
    const customerClasses =
      await this.customerClassRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        rest,
        schema,
      );
    return customerClasses;
  }

  getCustomerClassDetail(
    id: string,
    schema: string,
  ): Promise<CustomerClassModel> {
    return this.customerClassRepository.findById(id);
  }

  countCustomerClassByCondition(
    condition: any,
    schema: string,
  ): Promise<number> {
    return this.customerClassRepository.countByCondition(condition, schema);
  }

  async updateCustomerClass(
    id: string,
    payload: UpdateCustomerClassDto,
  ): Promise<number> {
    try {
      const updatedProduct = await this.customerClassRepository.update(
        id,
        payload,
      );
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteCustomerClass(id: string): Promise<void> {
    return await this.customerClassRepository.delete(id);
  }
}

import { v4 as uuidv4 } from 'uuid';
import {
  CreateCustomerClubDto,
  FilterCustomerClubDto,
  UpdateCustomerClubDto,
} from '../../dto/CustomerClubDto';
import { Inject, Injectable } from '@nestjs/common';
import { ICustomerClubRepository } from '../../repository/customer-club/CustomerClubRepositoryInterface';
import { ICustomerClubService } from './CustomerClubServiceInterface';
import { CustomerClubModel } from '../../../../models/CustomerClubs';

@Injectable()
export class CustomerClubServiceImplementation implements ICustomerClubService {
  constructor(
    @Inject(ICustomerClubRepository)
    private cityRepository: ICustomerClubRepository,
  ) {}

  async createCustomerClub(
    payload: CreateCustomerClubDto,
    schema: string,
  ): Promise<CustomerClubModel> {
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

  async getCustomerClubList(
    payload: FilterCustomerClubDto,
    schema: string,
  ): Promise<CustomerClubModel[]> {
    const { limit, page, ...rest } = payload;
    const customerClubs = await this.cityRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      rest,
      schema,
    );
    return customerClubs;
  }

  getCustomerClubDetail(
    id: string,
    schema: string,
  ): Promise<CustomerClubModel> {
    return this.cityRepository.findById(id);
  }

  countCustomerClubByCondition(
    condition: any,
    schema: string,
  ): Promise<number> {
    return this.cityRepository.countByCondition(condition, schema);
  }

  async updateCustomerClub(
    id: string,
    payload: UpdateCustomerClubDto,
  ): Promise<number> {
    try {
      const updatedProduct = await this.cityRepository.update(id, payload);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteCustomerClub(id: string): Promise<void> {
    return await this.cityRepository.delete(id);
  }
}

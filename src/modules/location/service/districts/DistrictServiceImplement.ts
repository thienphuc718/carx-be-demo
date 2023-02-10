import { v4 as uuidv4 } from 'uuid';

import {
  CreateDistrictDto,
  FilterDistrictDto,
  UpdateDistrictDto,
} from '../../dto/DistrictDto';
import { Inject, Injectable } from '@nestjs/common';
import { IDistrictRepository } from '../../repository/districts/DistrictRepositoryInterface';
import { IDistrictService } from './DistrictServiceInterface';
import { DistrictModel } from '../../../../models/Districts';

@Injectable()
export class DistrictServiceImplementation implements IDistrictService {
  constructor(
    @Inject(IDistrictRepository)
    private districtRepository: IDistrictRepository,
  ) {}
  async createDistrict(
    payload: CreateDistrictDto,
    schema: string,
  ): Promise<DistrictModel> {
    try {
      const district = await this.districtRepository.create(
        { ...payload, id: uuidv4() },
        schema,
      );
      return district;
    } catch (error) {
      throw error;
    }
  }

  async getDistrictList(
    payload: FilterDistrictDto,
    schema: string,
  ): Promise<DistrictModel[]> {
    const { limit, page, ...rest } = payload;
    const districts = await this.districtRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      rest,
      schema,
    );
    return districts;
  }

  getDistrictDetail(id: string, schema: string): Promise<DistrictModel> {
    return this.districtRepository.findById(id);
  }

  countDistrictByCondition(condition: any, schema: string): Promise<number> {
    return this.districtRepository.countByCondition(condition, schema);
  }

  async updateDistrict(
    id: string,
    payload: UpdateDistrictDto,
  ): Promise<number> {
    try {
      const updatedProduct = await this.districtRepository.update(id, payload);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteDistrict(id: string): Promise<void> {
    return await this.districtRepository.delete(id);
  }
}

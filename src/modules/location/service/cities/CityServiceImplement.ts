import {
  CreateCityDto,
  FilterCityDto,
  UpdateCityDto,
} from './../../dto/CityDto';
import { Inject, Injectable } from '@nestjs/common';
import { ICityRepository } from '../../repository/cities/CityRepositoryInterface';
import { ICityService } from './CityServiceInterface';
import { CityModel } from '../../../../models/Cities';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CityServiceImplementation implements ICityService {
  constructor(
    @Inject(ICityRepository)
    private cityRepository: ICityRepository,
  ) {}

  async createCity(payload: CreateCityDto, schema: string): Promise<CityModel> {
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

  async getCityList(
    payload: FilterCityDto,
    schema: string,
  ): Promise<CityModel[]> {
    const { limit, page, ...rest } = payload;
    const cities = await this.cityRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      rest,
      schema,
    );
    return cities;
  }

  getCityDetail(id: string, schema: string): Promise<CityModel> {
    return this.cityRepository.findById(id);
  }

  countCityByCondition(condition: any, schema: string): Promise<number> {
    return this.cityRepository.countByCondition(condition, schema);
  }

  async updateCity(id: string, payload: UpdateCityDto): Promise<number> {
    try {
      const updatedProduct = await this.cityRepository.update(id, payload);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteCity(id: string): Promise<void> {
    return await this.cityRepository.delete(id);
  }
}

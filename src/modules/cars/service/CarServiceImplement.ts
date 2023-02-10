import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CarModel } from '../../../models/Cars';

import {
  FilterCarDto,
  CreateCarPayloadDto,
  UpdateCarPayloadDto,
} from '../dto/CarDto';
import { ICarRepository } from '../repository/CarRepositoryInterface';
import { ICarService } from './CarServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { IForbiddenKeywordService } from '../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';

@Injectable()
export class CarServiceImplementation implements ICarService {
  constructor(
    @Inject(ICarRepository)
    private roleRepository: ICarRepository,
    @Inject(forwardRef(() => IForbiddenKeywordService))
    private forbiddenKeywordService: IForbiddenKeywordService,
  ) {}

  async getCarList(payload: FilterCarDto): Promise<CarModel[]> {
    try {
      const { limit, page } = payload;
      const roles = await this.roleRepository.findAllByCondition(
        limit,
        page,
        {},
      );
      return roles;
    } catch (error) {
      throw error
    }
  }

  getCarDetail(id: string): Promise<CarModel> {
    try {
      return this.roleRepository.findById(id);
    } catch (error) {
      throw error;

    }
  }

  async createCar(payload: CreateCarPayloadDto): Promise<CarModel> {
    try {
      const createdCar = await this.roleRepository.create(payload);
      return createdCar;
    } catch (error) {
      throw error;
    }
  }

  async updateCar(
    id: string,
    payload: UpdateCarPayloadDto,
  ): Promise<number> {
    try {
      const checkForbiddenKeyword = await this.forbiddenKeywordService.checkKeywordsExist([
        payload.brand,
        payload.model_name,
        payload.car_no,
        payload.color,
        payload.tire_no,
        payload.vin_no,
      ]);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      const updatedCar = await this.roleRepository.update(id, payload);
      return updatedCar;
    } catch (error) {
      throw error;
    }
  }

  async deleteCar(id: string): Promise<void> {
    try {
      const role = await this.getCarDetail(id);
      if (!role) {
        throw new Error('Car not found');
      }
      this.roleRepository.delete(id);
    } catch (error) {
      throw error
    }
  }
}

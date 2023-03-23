import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { CustomLocationModel } from '../../../models';
import {
  CreateCustomLocationPayloadDto,
  FilterCustomLocationDto,
  UpdateCustomLocationOrderPayloadDto,
  UpdateCustomLocationPayloadDto,
} from '../dto/CustomLocationDto';
import { ICustomLocationRepository } from '../repository/CustomLocationRepositoryInterface';
import { ICustomLocationService } from './CustomLocationServiceInterface';

export class CustomLocationServiceImplementation implements ICustomLocationService {
  constructor(
    @Inject(ICustomLocationRepository) private customLocationRepository: ICustomLocationRepository,
  ) { }
  getCustomLocationList(payload: FilterCustomLocationDto): Promise<CustomLocationModel[]> {
    const { limit, page, ...rest } = payload;
    return this.customLocationRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      rest,
    );
  }
  getCustomLocationDetail(id: string): Promise<CustomLocationModel> {
    return this.customLocationRepository.findById(id);
  }
  async createCustomLocation(payload: CreateCustomLocationPayloadDto): Promise<CustomLocationModel> {
    try {
      const customLocationList = await this.getCustomLocationListWithoutPagination({});
      if (customLocationList.length === 15) {
        throw new Error('Maximum amount of customLocations is exceeded');
      }
      const createdCustomLocation = await this.customLocationRepository.create(payload);
      return createdCustomLocation;
    } catch (error) {
      throw error;
    }
  }
  async updateCustomLocation(
    id: string,
    payload: UpdateCustomLocationPayloadDto,
  ): Promise<CustomLocationModel> {
    try {
      const [nModified, customLocations] = await this.customLocationRepository.update(
        id,
        payload,
      );
      if (!nModified) {
        throw new Error(`Cannot update customLocation`);
      }
      const updatedCustomLocation = customLocations[0];
      return updatedCustomLocation;
    } catch (error) {
      throw error;
    }
  }
  countCustomLocationByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.customLocationRepository.count(rest);
  }
  async deleteCustomLocation(id: string): Promise<boolean> {
    try {
      const customLocation = await this.getCustomLocationDetail(id);
      if (!customLocation) {
        throw new Error('CustomLocation not found');
      }
      const customLocationOrder: number = customLocation.order;
      const nDeleted = await this.customLocationRepository.delete(id);
      if (!nDeleted) {
        return false;
      } else if (customLocationOrder === 15) {
        return true;
      } else {
        const customLocations = await this.getCustomLocationListWithoutPagination({
          order: {
            [Op.gt]: customLocationOrder,
          },
        });
        await Promise.all(
          customLocations.map((customLocation) => {
            customLocation.order -= 1;
            customLocation.save();
          }),
        );
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
  async updateCustomLocationOrder(
    id: string,
    payload: UpdateCustomLocationOrderPayloadDto,
  ): Promise<CustomLocationModel> {
    try {
      const { new_order } = payload;
      const verifiedCustomLocation = await this.getCustomLocationDetail(id);
      if (!verifiedCustomLocation) {
        throw new Error('CustomLocation not found');
      }
      const orderPlacedCustomLocation = await this.customLocationRepository.findOneByCondition({
        order: new_order,
      });
      if (orderPlacedCustomLocation) {
        await orderPlacedCustomLocation.update({ order: verifiedCustomLocation.order });
      }
      const [nModified, customLocations] = await this.customLocationRepository.update(
        verifiedCustomLocation.id,
        { order: new_order },
      );
      if (!nModified) {
        throw new Error(`Cannot update customLocation's order`);
      }
      const updatedCustomLocation = customLocations[0];
      return updatedCustomLocation;
    } catch (error) {
      throw error;
    }
  }
  getCustomLocationListWithoutPagination(condition: any) {
    return this.customLocationRepository.findAllByConditionWithoutPagination(condition);
  }
}

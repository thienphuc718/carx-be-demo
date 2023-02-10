import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { SystemConfigurationModel } from '../../../models';
import {
  CreateSystemConfigurationDto,
  FilterSystemConfigurationDto,
  UpdateSystemConfigurationDto,
} from '../dto/SystemConfigurationDto';
import { ISystemConfigurationRepository } from '../repository/SystemConfigurationRepositoryInterface';
import { ISystemConfigurationService } from './SystemConfigurationServiceInterface';

export class SystemConfigurationServiceImplementation
  implements ISystemConfigurationService
{
  constructor(
    @Inject(ISystemConfigurationRepository)
    private systemConfigurationRepository: ISystemConfigurationRepository,
  ) {}

  async getSystemConfigurationList(
    payload: FilterSystemConfigurationDto,
  ): Promise<SystemConfigurationModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const queryCondition = this.buildSearchQueryCondition(rest);
      const systemConfigurations =
        await this.systemConfigurationRepository.findAllWithCondition(
          limit,
          (page - 1) * limit,
          queryCondition,
        );
      return systemConfigurations;
    } catch (error) {
      throw error;
    }
  }

  getSystemConfigurationDetailById(
    id: string,
  ): Promise<SystemConfigurationModel> {
    return this.systemConfigurationRepository.findById(id);
  }

  getSystemConfigurationDetailByCondition(
    condition: any,
  ): Promise<SystemConfigurationModel> {
    return this.systemConfigurationRepository.findOneByCondition(condition);
  }

  createSystemConfiguration(
    payload: CreateSystemConfigurationDto,
  ): Promise<SystemConfigurationModel> {
    return this.systemConfigurationRepository.create(payload);
  }

  async updateSystemConfiguration(
    id: string,
    payload: UpdateSystemConfigurationDto,
  ): Promise<SystemConfigurationModel> {
    try {
      const [nModified, systemConfigurations] =
        await this.systemConfigurationRepository.update(id, payload);
      if (!nModified) {
        throw new Error(`Cannot update system configuration`);
      }
      return systemConfigurations[0];
    } catch (error) {
      throw error;
    }
  }

  countSystemConfigurationByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.systemConfigurationRepository.countByCondition(queryCondition);
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    };

    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }

    if (queryCondition.name) {
      queryCondition = {
        ...queryCondition,
        name: {
          [Op.iLike]: `%${condition.name}%`,
        },
      };
    }
    return queryCondition;
  }
}

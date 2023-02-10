import { SystemConfigurationModel } from '../../../models';
import {
  CreateSystemConfigurationDto,
  FilterSystemConfigurationDto,
  UpdateSystemConfigurationDto,
} from '../dto/SystemConfigurationDto';

export interface ISystemConfigurationService {
  getSystemConfigurationList(
    payload: FilterSystemConfigurationDto,
  ): Promise<SystemConfigurationModel[]>;
  getSystemConfigurationDetailById(
    id: string,
  ): Promise<SystemConfigurationModel>;
  getSystemConfigurationDetailByCondition(
    condition: any,
  ): Promise<SystemConfigurationModel>;
  updateSystemConfiguration(
    id: string,
    payload: UpdateSystemConfigurationDto,
  ): Promise<SystemConfigurationModel>;
  createSystemConfiguration(
    payload: CreateSystemConfigurationDto,
  ): Promise<SystemConfigurationModel>;
  countSystemConfigurationByCondition(condition: any): Promise<number>;
}

export const ISystemConfigurationService = Symbol(
  'ISystemConfigurationService',
);

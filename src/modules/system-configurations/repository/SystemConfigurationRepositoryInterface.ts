import { SystemConfigurationModel } from '../../../models';

export interface ISystemConfigurationRepository {
  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<SystemConfigurationModel[]>;
  findOneByCondition(condition: any): Promise<SystemConfigurationModel>;
  findById(id: string): Promise<SystemConfigurationModel>;
  create(payload: any): Promise<SystemConfigurationModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, SystemConfigurationModel[]]>;
  countByCondition(condition: any): Promise<number>;
}

export const ISystemConfigurationRepository = Symbol(
  'ISystemConfigurationRepository',
);

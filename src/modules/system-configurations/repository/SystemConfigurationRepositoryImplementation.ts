import { InjectModel } from '@nestjs/sequelize';
import { SystemConfigurationModel } from '../../../models';
import { ISystemConfigurationRepository } from './SystemConfigurationRepositoryInterface';

export class SystemConfigurationRepositoryImplementation
  implements ISystemConfigurationRepository
{
  constructor(
    @InjectModel(SystemConfigurationModel)
    private systemConfigurationModel: typeof SystemConfigurationModel,
  ) {}

  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<SystemConfigurationModel[]> {
    return this.systemConfigurationModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['updated_at', 'desc']],
    });
  }

  findOneByCondition(condition: any): Promise<SystemConfigurationModel> {
    return this.systemConfigurationModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findById(id: string): Promise<SystemConfigurationModel> {
    return this.systemConfigurationModel.findByPk(id);
  }

  create(payload: any): Promise<SystemConfigurationModel> {
    return this.systemConfigurationModel.create(payload);
  }

  update(
    id: string,
    payload: any,
  ): Promise<[number, SystemConfigurationModel[]]> {
    return this.systemConfigurationModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  countByCondition(condition: any): Promise<number> {
    return this.systemConfigurationModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
}

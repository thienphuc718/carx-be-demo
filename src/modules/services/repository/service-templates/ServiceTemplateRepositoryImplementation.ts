import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceCategoryModel } from '../../../../models/ServiceCategories';
import { ServiceTemplateModel } from '../../../../models/ServiceTemplates';
import { IServiceTemplateRepository } from './ServiceTemplateRepositoryInterface';

@Injectable()
export class ServiceTemplateRepositoryImplementation
  implements IServiceTemplateRepository
{
  constructor(
    @InjectModel(ServiceTemplateModel)
    private serviceTemplateModel: typeof ServiceTemplateModel,
  ) {}

  findAllByCondition(
    limit: number | undefined,
    offset: number | undefined,
    condition: any,
  ): Promise<ServiceTemplateModel[]> {
    return this.serviceTemplateModel.findAll({
      limit,
      offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      attributes: { exclude: ['search'] },
      include: [{ model: ServiceCategoryModel, attributes: ['id', 'name'] }],
    });
  }

  countByKeyword(condition: any): Promise<number> {
    return this.serviceTemplateModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
}

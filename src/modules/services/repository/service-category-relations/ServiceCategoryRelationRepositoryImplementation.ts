import {InjectModel} from '@nestjs/sequelize';
import { ServiceCategoryRelationModel, ServiceModel } from '../../../../models';
import { IServiceCategoryRelationRepository } from './ServiceCategoryRelationRepositoryInterface';
import { Sequelize } from "sequelize-typescript";

export class ServiceCategoryRelationRepositoryImplementation
  implements IServiceCategoryRelationRepository {
  constructor(
    @InjectModel(ServiceCategoryRelationModel)
    private serviceCategoryRelationModel: typeof ServiceCategoryRelationModel,
    private sequelize: Sequelize
  ) {
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ServiceCategoryRelationModel[]> {
    return this.serviceCategoryRelationModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ServiceModel,
          as: 'service_details',
          where: {
            is_deleted: false,
          }
        },
      ],
      order: [['updated_at', 'desc']],
    });
  }

  countByCondition(condition: any): Promise<number> {
    return this.serviceCategoryRelationModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<ServiceCategoryRelationModel[]> {
    return this.serviceCategoryRelationModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ServiceModel,
          as: 'service_details',
          where: {
            is_deleted: false,
          }
        },
      ],
    });
  }
}

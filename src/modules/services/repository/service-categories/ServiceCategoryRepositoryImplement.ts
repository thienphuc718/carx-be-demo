import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceCategoryRelationModel, ServiceModel } from '../../../../models';
import { ServiceCategoryModel } from '../../../../models/ServiceCategories';
import { IServiceCategoryRepository } from './ServiceCategoryRepositoryInterface';

@Injectable()
export class ServiceCategoryRepositoryImplementation
  implements IServiceCategoryRepository
{
  constructor(
    @InjectModel(ServiceCategoryModel)
    private serviceCategoryModel: typeof ServiceCategoryModel,
  ) {}

  findAll(): Promise<ServiceCategoryModel[]> {
    return this.serviceCategoryModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ServiceCategoryModel[]> {
    return this.serviceCategoryModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ServiceCategoryRelationModel,
          as: 'categories',
          required: false,
          where: {
            is_deleted: false,
          },
        },
      ],
      order: [['created_at', 'desc']],
    });
  }

  findById(id: string): Promise<ServiceCategoryModel> {
    return this.serviceCategoryModel.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: ServiceCategoryRelationModel,
          as: 'categories',
          required: false,
          where: {
            is_deleted: false,
          },
        },
      ],
    });
  }

  create(payload: any): Promise<ServiceCategoryModel> {
    return this.serviceCategoryModel.create(payload);
  }

  update(id: string, payload: any): Promise<any> {
    return this.serviceCategoryModel.update(payload, {
      where: {
        id: id,
      },
    });
  }

  delete(id: string): void {
    this.serviceCategoryModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  count(condition?: any): Promise<number> {
    return this.serviceCategoryModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findOneByCondition(condition: any): Promise<ServiceCategoryModel> {
    return this.serviceCategoryModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      }
    })
  }
}

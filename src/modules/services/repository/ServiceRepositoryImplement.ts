import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateServiceCategoryRelationEntityDto, CreateServiceEntityDto, UpdateServiceEntityDto } from '../dto/ServiceDto';
import { IServiceRepository } from './ServiceRepositoryInterface';
import { AgentModel, ProductVariantModel, ProductModel, ServiceCategoryModel, ServiceCategoryRelationModel, ServiceModel } from '../../../models';
import { getTextSearchString } from "../../../helpers/stringHelper";
import { Op } from "sequelize";

@Injectable()
export class ServiceRepositoryImplementation implements IServiceRepository {
  constructor(
    @InjectModel(ServiceModel) private serviceModel: typeof ServiceModel,
    @InjectModel(ServiceCategoryRelationModel)
    private serviceCategoryRelationModel: typeof ServiceCategoryRelationModel,
    private sequelize: Sequelize,
  ) { }

  findAll(): Promise<ServiceModel[]> {
    return this.serviceModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findOneByCondition(condition: any): Promise<ServiceModel> {
    return this.serviceModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ProductModel,
          include: [{ model: ProductVariantModel }],
        },
        {
          model: AgentModel,
          required: false,
          attributes: ['id'],
        },
        {
          model: ServiceCategoryRelationModel,
          required: false,
          include: [
            {
              model: ServiceCategoryModel,
              required: false,
            },
          ],
        },
      ],
    });
  }

  findAllByCondition(
    limit: number | undefined,
    offset: number | undefined,
    condition: any,
    order_by?: any,
    order_type?: any,
  ): Promise<ServiceModel[]> {
    const { variantCondition, productCondition, ...service_condition } = condition;
    let tsVectorSearchString = null;
    if (service_condition.name) {
      tsVectorSearchString = getTextSearchString(service_condition.name);
      service_condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete service_condition.name;
    }
    if (!order_by) {
      order_by = 'updated_at'
    }
    if (!order_type) {
      order_type = 'desc'
    }
    return this.serviceModel.findAll({
      limit,
      offset,
      where: {
        ...service_condition,
      },
      include: [
        {
          model: ProductModel,
          where: {
            ...productCondition
          },
          required: true,
          include: [
            {
              model: ProductVariantModel,
              where: { ...variantCondition, is_deleted: false },
              separate: true,
              limit: 1,
            },
          ],
        },
        {
          model: AgentModel,
          required: false,
          attributes: ['id', 'longitude', 'latitude', 'address'],
        },
        {
          model: ServiceCategoryRelationModel,
          required: false,
          include: [
            {
              model: ServiceCategoryModel,
              // where: { is_deleted: false },
              required: false,
            },
          ],
        },
      ],
      order: [
        tsVectorSearchString ?
          this.sequelize.literal(`ts_rank(services.tsv_converted_name, to_tsquery('${tsVectorSearchString}')) desc`)
          :
          [order_by, order_type]],
    });
  }

  findAllByConditionRandomlyOrdered(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ServiceModel[]> {
    return this.serviceModel.findAll({
      limit,
      offset,
      where: {
        ...condition,
      },
      include: [
        {
          model: ProductModel,
          include: [{ model: ProductVariantModel }],
        },
        {
          model: AgentModel,
          required: false,
          attributes: ['id'],
        },
        {
          model: ServiceCategoryRelationModel,
          required: false,
          include: [
            {
              model: ServiceCategoryModel,
              // where: { is_deleted: false },
              required: false,
            },
          ],
        },
      ],
      order: this.sequelize.random(),
    });
  }

  countByCondition(condition: any): Promise<number> {
    const { variantCondition, productCondition, ...service_condition } = condition;
    let tsVectorSearchString = null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      service_condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete service_condition.name;
    }
    return this.serviceModel.count({
      where: {
        ...service_condition,
        is_deleted: false,
      },
      include: [
        {
          model: ProductModel,
          // required: false,
          where: {
            ...productCondition
          },
          include: [
            {
              model: ProductVariantModel,
              where: { ...variantCondition, is_deleted: false },
            },
          ],
        },
        {
          model: AgentModel,
          required: false,
          attributes: ['id'],
        },
        {
          model: ServiceCategoryRelationModel,
          required: false,
          include: [
            {
              model: ServiceCategoryModel,
              // where: { is_deleted: false },
              required: false,
            },
          ],
        },
      ],
    });
  }

  findById(id: string): Promise<ServiceModel> {
    return this.serviceModel.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { product_id: id }
        ]
      },
      include: [
        {
          model: ProductModel,
          include: [{ model: ProductVariantModel }],
        },
        {
          model: AgentModel,
          required: false,
          attributes: ['id'],
        },
        {
          model: ServiceCategoryRelationModel,
          required: false,
          include: [
            {
              model: ServiceCategoryModel,
              // where: { is_deleted: false },
              required: false,
            },
          ],
        },
      ],
    });
  }

  findServiceCategoryRelationsByCondition(
    condition: any,
  ): Promise<ServiceCategoryRelationModel[]> {
    return this.serviceCategoryRelationModel.findAll({
      where: { ...condition },
    });
  }

  create(
    payload: CreateServiceEntityDto,
    transaction: any,
  ): Promise<ServiceModel> {
    return this.serviceModel.create(payload, { transaction });
  }

  bulkCreateServiceCategories(
    payload: CreateServiceCategoryRelationEntityDto[],
    transaction: any,
  ): Promise<ServiceCategoryRelationModel[]> {
    return this.serviceCategoryRelationModel.bulkCreate(payload, {
      transaction,
    });
  }

  update(id: string, payload: UpdateServiceEntityDto): Promise<[number]> {
    return this.serviceModel.update(payload, {
      where: {
        id: id,
      },
    });
  }

  updateServiceCategoryRelationByCondition(
    payload: any,
    condition: any,
    transaction?: any,
  ): void {
    this.serviceCategoryRelationModel.update(payload, {
      where: { ...condition },
      transaction,
    });
  }

  delete(id: string, transaction?: any): void {
    this.serviceModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
        transaction,
      },
    );
  }

  addServiceToCategory(payload: any): Promise<ServiceModel> {
    this.serviceCategoryRelationModel.create(payload);
    throw new Error('Method not implemented.');
  }

  findAllByConditionWithoutPagination(condition: any): Promise<ServiceModel[]> {
    return this.serviceModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ServiceCategoryRelationModel,
          as: 'categories',
          where: {
            is_deleted: false,
          },
          attributes: ['service_id', 'category_id'],
        },
      ],
    });
  }

  updateByCondition(condition: any, payload: any) {
    return this.serviceModel.update(payload, {
      where: {
        ...condition
      }
    })
  }
}

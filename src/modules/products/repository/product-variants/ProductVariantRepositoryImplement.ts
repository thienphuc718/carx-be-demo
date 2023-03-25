import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariantModel } from '../../../../models/ProductVariants';
import { IProductVariantRepository } from './ProductVariantRepositoryInterface';
import {
  CreateProductVariantEntityDto,
  UpdateProductVariantPayloadDto,
} from '../../dto/ProductVariantDto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductVariantRepositoryImplementation
  implements IProductVariantRepository
{
  constructor(
    @InjectModel(ProductVariantModel)
    private productVariantModel: typeof ProductVariantModel,
    private sequelize: Sequelize,
  ) {}

  findAll(): Promise<ProductVariantModel[]> {
    return this.productVariantModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findAllBySkus(skuList: string[]): Promise<ProductVariantModel[]> {
    return this.productVariantModel.findAll({
      where: {
        sku: skuList,
      },
    });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductVariantModel[]> {
    return this.productVariantModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.productVariantModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string): Promise<ProductVariantModel> {
    return this.productVariantModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
    });
  }

  findOneByCondition(condition: any): Promise<ProductVariantModel> {
    return this.productVariantModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  create(
    payload: any,
    callback: (transaction: any) => Promise<void>,
  ): Promise<ProductVariantModel> {
    return this.sequelize.transaction(async (t) => {
      const result = await this.productVariantModel.create(payload);
      await callback(t);
      return result;
    });
  }

  update(
    id: string,
    payload: UpdateProductVariantPayloadDto,
    transaction?: any,
  ): Promise<[number, ProductVariantModel[]]> {
    return this.productVariantModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
      transaction,
    });
  }

  delete(id: string): void {
    this.productVariantModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  bulkCreate(
    payload: CreateProductVariantEntityDto[],
    transaction: any,
  ): Promise<ProductVariantModel[]> {
    return this.productVariantModel.bulkCreate(payload, { transaction });
  }

  deleteByCondition(condition: any, transaction: any): Promise<any> {
    return this.productVariantModel.update(
      { is_deleted: true },
      {
        where: condition,
        transaction,
      },
    );
  }

  findAllByConditionWithoutPagination(condition: any): Promise<ProductVariantModel[]> {
    return this.productVariantModel.findAll({
      where: {
        is_deleted: false,
        ...condition
      }
    });
  }
}

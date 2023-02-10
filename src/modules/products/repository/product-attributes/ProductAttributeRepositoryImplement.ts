import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProductAttributeModel } from '../../../../models/ProductAttributes';
import {
  CreateProductAttributeEntityDto,
  UpdateProductAttributeDto,
} from '../../dto/ProductAttributeDto';
import { IProductAttributeRepository } from './ProductAttributeRepositoryInterface';

@Injectable()
export class ProductAttributeRepositoryImplementation
  implements IProductAttributeRepository
{
  constructor(
    @InjectModel(ProductAttributeModel)
    private productAttributeModel: typeof ProductAttributeModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductAttributeModel[]> {
    return this.productAttributeModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findOneByCondition(condition: any): Promise<ProductAttributeModel> {
    return this.productAttributeModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  countByCondition(condition: any): Promise<number> {
    return this.productAttributeModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findById(id: string): Promise<ProductAttributeModel> {
    return this.productAttributeModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(
    payload: CreateProductAttributeEntityDto,
  ): Promise<ProductAttributeModel> {
    return this.productAttributeModel.create(payload);
  }

  update(
    id: string,
    payload: UpdateProductAttributeDto,
  ): Promise<[number, ProductAttributeModel[]]> {
    return this.productAttributeModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(ids: string[]): Promise<[number, ProductAttributeModel[]]> {
    return this.productAttributeModel.update(
      { is_deleted: true },
      {
        where: {
          id: { [Op.in]: ids },
        },
        returning: true,
      },
    );
  }
}

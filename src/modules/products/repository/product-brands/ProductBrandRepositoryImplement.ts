import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProductBrandModel } from '../../../../models/ProductBrands';
import {
  CreateProductBrandDto,
  UpdateProductBrandDto,
} from '../../dto/ProductBrandDto';
import { IProductBrandRepository } from './ProductBrandRepositoryInterface';

@Injectable()
export class ProductBrandRepositoryImplementation
  implements IProductBrandRepository
{
  constructor(
    @InjectModel(ProductBrandModel)
    private productBrandModel: typeof ProductBrandModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductBrandModel[]> {
    return this.productBrandModel.findAll({
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
    return this.productBrandModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findById(id: string): Promise<ProductBrandModel> {
    return this.productBrandModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: CreateProductBrandDto): Promise<ProductBrandModel> {
    return this.productBrandModel.create(payload);
  }

  update(
    id: string,
    payload: UpdateProductBrandDto,
  ): Promise<[number, ProductBrandModel[]]> {
    return this.productBrandModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(ids: string[]): Promise<[number, ProductBrandModel[]]> {
    return this.productBrandModel.update(
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

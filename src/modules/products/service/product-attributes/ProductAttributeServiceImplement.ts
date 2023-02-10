import { Inject, Injectable } from '@nestjs/common';
import { ProductAttributeModel } from '../../../../models/ProductAttributes';
import {
  ProductAttributeValueDto,
  CreateProductAttributePayloadDto,
  UpdateProductAttributeDto,
} from '../../dto/ProductAttributeDto';
import { IProductAttributeRepository } from '../../repository/product-attributes/ProductAttributeRepositoryInterface';
import { IProductAttributeService } from './ProductAttributeServiceInterface';
import { PaginationDto } from '../../dto';

@Injectable()
export class ProductAttributeServiceImplementation
  implements IProductAttributeService
{
  constructor(
    @Inject(IProductAttributeRepository)
    private productAttributeRepository: IProductAttributeRepository,
  ) {}

  async getProductAttributeList(
    pagination: PaginationDto,
  ): Promise<ProductAttributeModel[]> {
    const { limit, page } = pagination;
    const productAttributes =
      await this.productAttributeRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        {},
      );
    return productAttributes;
  }

  getProductAttributeByCondition(
    condition: any,
  ): Promise<ProductAttributeModel> {
    return this.productAttributeRepository.findOneByCondition(condition);
  }

  getProductAttributeDetail(id: string): Promise<ProductAttributeModel> {
    return this.productAttributeRepository.findById(id);
  }

  countProductAttributeByCondition(condition: any): Promise<number> {
    return this.productAttributeRepository.countByCondition(condition);
  }

  async createProductAttribute(
    payload: CreateProductAttributePayloadDto,
  ): Promise<ProductAttributeModel> {
    try {
      const existedAttribute = await this.getProductAttributeByCondition({
        code: payload.code,
      });
      if (existedAttribute) {
        throw new Error('Attribute already existed');
      }
      const productAttribute = await this.productAttributeRepository.create(
        payload,
      );
      return productAttribute;
    } catch (error) {
      throw error;
    }
  }

  async updateProductAttribute(
    id: string,
    payload: UpdateProductAttributeDto,
  ): Promise<ProductAttributeModel> {
    try {
      const existedAttribute = await this.getProductAttributeByCondition({
        id,
      });
      if (!existedAttribute) {
        throw new Error('Attribute not found');
      }
      const updatedProductAttribute =
        await this.productAttributeRepository.update(id, payload);
      return updatedProductAttribute[1][0];
    } catch (error) {
      throw error;
    }
  }

  async createProductAttributeValue(
    id: string,
    payload: ProductAttributeValueDto,
  ): Promise<ProductAttributeModel> {
    try {
      const attribute = await this.getProductAttributeDetail(id);
      const { values } = attribute;
      const existedValue = values.find((value) => value.code === payload.code);
      if (existedValue) {
        throw new Error('Value already existed');
      }
      const newValues = [...values, payload];
      const [_, updatedAttibute] = await this.productAttributeRepository.update(
        id,
        { values: newValues },
      );
      return updatedAttibute[0];
    } catch (error) {
      throw error;
    }
  }

  deleteProductAttribute(
    ids: string[],
  ): Promise<[number, ProductAttributeModel[]]> {
    return this.productAttributeRepository.delete(ids);
  }

  async deleteProductAttributeValues(
    id: string,
    codes: string[],
  ): Promise<ProductAttributeModel> {
    try {
      const attribute = await this.getProductAttributeDetail(id);
      const { values } = attribute;
      const newValues = values.filter((value) => !codes.includes(value.code));
      const [_, updatedAttribute] =
        await this.productAttributeRepository.update(id, { values: newValues });
      return updatedAttribute[0];
    } catch (error) {
      throw error;
    }
  }

  async bulkAddValue(
    id: string,
    addValues: ProductAttributeValueDto[],
  ): Promise<boolean> {
    let attribute = await this.getProductAttributeDetail(id);
    if (attribute && attribute.values) {
      let values = attribute.values;
      for (let i = 0; i < addValues.length; i++) {
        let addValue = addValues[i];
        let checkExists = values.filter((value) => value.code == addValue.code);
        if (!checkExists.length) {
          values.push(addValue);
        }
      }
      await this.updateProductAttribute(id, {
        values: values,
      });
    }
    return true;
  }
}

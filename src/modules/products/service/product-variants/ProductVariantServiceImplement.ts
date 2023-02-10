import { Inject, Injectable } from '@nestjs/common';
import { ProductVariantModel } from '../../../../models/ProductVariants';
import {
  CreateProductVariantEntityDto,
  UpdateProductVariantPayloadDto,
  ProductVariantValueDto,
} from '../../dto/ProductVariantDto';
import { IProductVariantRepository } from '../../repository/product-variants/ProductVariantRepositoryInterface';
import { IProductVariantService } from './ProductVariantServiceInterface';
import { IProductService } from '../products/ProductServiceInterface';
import { ProductAttributePayloadDto } from '../../dto/ProductDto';
import { PaginationDto } from '../../dto';
import { IProductRepository } from '../../repository/products/ProductRepositoryInterface';

@Injectable()
export class ProductVariantServiceImplementation
  implements IProductVariantService
{
  constructor(
    @Inject(IProductVariantRepository)
    private productVariantRepository: IProductVariantRepository,
    @Inject(IProductRepository)
    private productRepository: IProductRepository,
    @Inject(IProductService)
    private productService: IProductService,
  ) {}

  getProductVariantList(
    productId: string,
    pagination: PaginationDto,
  ): Promise<ProductVariantModel[]> {
    const { limit, page } = pagination;
    return this.productVariantRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      { product_id: productId },
    );
  }
  countProductVariantByCondition(condition: any): Promise<number> {
    return this.productVariantRepository.countByCondition(condition);
  }

  getProductVariantDetail(id: string): Promise<ProductVariantModel> {
    return this.productVariantRepository.findById(id);
  }

  async getListFromListSku(skuList: string[]): Promise<ProductVariantModel[]> {
    try {
      const data = await this.productVariantRepository.findAllBySkus(skuList);
      return data;
    } catch (error) {
      throw error;
    }
  }

  buildProductAttributeSelectedFromVariant(
    variantAttributeValues: ProductVariantValueDto[],
  ): ProductAttributePayloadDto[] {
    let attributeArray: ProductAttributePayloadDto[] = [];
    for (let j = 0; j < variantAttributeValues.length; j++) {
      let index = -1;
      // add attribute to array if not exists
      let attribute = variantAttributeValues[j];
      for (let k = 0; k < attributeArray.length; k++) {
        if (attributeArray[k].attribute_id == attribute.attribute_id) {
          index = k;
        }
      }
      if (index === -1) {
        attributeArray.push({
          attribute_id: attribute.attribute_id,
          values: [attribute.attribute_value],
        });
      } else {
        // check if attributeArray[index].values
        let checkExists = attributeArray[index].values.filter(
          (attributeValue) =>
            attributeValue.code == attribute.attribute_value.code,
        );
        if (!checkExists.length) {
          attributeArray[index].values.push(attribute.attribute_value);
        }
      }
    }
    return attributeArray;
  }

  async createProductVariant(
    payload: CreateProductVariantEntityDto,
  ): Promise<ProductVariantModel> {
    try {
      const { product_id, value } = payload;
      const selectedAttributeIds =
        await this.productService.getProductSelectAttributeIds(product_id);
      const attributes = this.buildProductAttributeSelectedFromVariant(value);
      const createNewAttributeSelectedArray = [];

      for (let i = 0; i < attributes.length; i++) {
        let attribute = attributes[i];
        if (selectedAttributeIds.indexOf(attribute.attribute_id) == -1) {
          // create new attribute selected if attribute is not chosen before
          createNewAttributeSelectedArray.push({
            product_id: product_id,
            order: i,
            ...attribute,
          });
        } else {
          // update values of attribute selected if value not existed
          const existedAttributeSelected =
            await this.productRepository.findProductAttributeSelectedByCondition(
              {
                product_id: product_id,
                attribute_id: attribute.attribute_id,
              },
            );
          const values = existedAttributeSelected[0].values;
          const isExisted = values.find(
            (value) => value.code === attribute.values[0].code,
          );
          if (!isExisted) {
            values.push(attribute.values[0]);
          }
          await this.productRepository.updateProductAttributeSelectedByCondition(
            { values },
            {
              product_id: product_id,
              attribute_id: attribute.attribute_id,
            },
            null,
          );
        }
        // add value to attribute values if not exist
        // await this.productAttributeService.bulkAddValue(
        //   attribute.attribute_id,
        //   attribute.values,
        // );
      }
      const callback = async (transaction) => {
        await this.productRepository.bulkCreateProductAttributeSelected(
          createNewAttributeSelectedArray,
          transaction,
        );
      };
      const productVariant = await this.productVariantRepository.create(
        { ...payload, sku: `${+new Date()}` },
        callback,
      );
      return productVariant;
    } catch (error) {
      throw error;
    }
  }

  getProductVariantByCondition(condition: any): Promise<ProductVariantModel> {
    return this.productVariantRepository.findOneByCondition(condition);
  }

  async updateProductVariant(
    id: string,
    payload: UpdateProductVariantPayloadDto,
  ): Promise<[number, ProductVariantModel[]]> {
    try {
      const productVariant = await this.productVariantRepository.findById(id);
      if (productVariant) {
        const updatedProductVariant =
          await this.productVariantRepository.update(id, payload);
        return updatedProductVariant;
      } else {
        throw new Error('Variant not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProductVariant(id: string): Promise<void> {
    const productVariant = await this.getProductVariantDetail(id);
    if (!productVariant) {
      throw new Error('ProductVariant not found');
    }
    this.productVariantRepository.delete(id);
  }
}

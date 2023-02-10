import { InsuranceProductServiceInterface } from './InsuranceProductServiceInterface';
import {forwardRef, Inject} from '@nestjs/common';
import { InsuranceProductRepositoryInterface } from '../../repository/insurance-products/InsuranceProductRepositoryInterface';
import {
  CreateInsuranceProductEntityDto,
  FilterInsuranceProductDto,
  UpdateInsuranceProductPayloadDto,
} from '../../dto/InsuranceProductDto';
import { InsuranceProductModel } from '../../../../models';
import {IProductService} from "../products/ProductServiceInterface";

export class InsuranceProductServiceImplementation
  implements InsuranceProductServiceInterface
{
  constructor(
    @Inject(InsuranceProductRepositoryInterface)
    private insuranceProductRepository: InsuranceProductRepositoryInterface,
    @Inject(forwardRef(() => IProductService)) private productService: IProductService,
  ) {}

  async createInsuranceProduct(
    payload: CreateInsuranceProductEntityDto,
    userId: string,
  ): Promise<InsuranceProductModel> {
    try {
      return this.insuranceProductRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async deleteInsuranceProduct(id: string): Promise<boolean> {
    try {
      const insuranceProduct = await this.getInsuranceProductDetail(id);
      if (!insuranceProduct) {
        throw new Error('Insurance Product not found');
      }
      const nDeleted = await this.insuranceProductRepository.deleteById(
        insuranceProduct.id,
      );
      return !!nDeleted;
    } catch (error) {
      throw error;
    }
  }

  getInsuranceProductDetail(id: string): Promise<InsuranceProductModel> {
    return this.insuranceProductRepository.findById(id);
  }

  async getInsuranceProductList(
    payload: FilterInsuranceProductDto,
  ): Promise<InsuranceProductModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      return this.insuranceProductRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        rest,
      );
    } catch (error) {
      throw error;
    }
  }

  getInsuranceProductListByConditionWithoutPagination(
    condition: any,
  ): Promise<InsuranceProductModel[]> {
    return this.insuranceProductRepository.findAllByConditionWithoutPagination(
      condition,
    );
  }

  async updateInsuranceProductById(
    id: string,
    payload: UpdateInsuranceProductPayloadDto,
  ): Promise<InsuranceProductModel> {
    try {
      const { product_info, ...rest } = payload;
      const insuranceProduct = await this.getInsuranceProductDetail(id);
      if (!insuranceProduct) {
        throw new Error('Insurance Product not found');
      }
      if (product_info) {
        await this.productService.updateProduct(insuranceProduct.product_id, { ...product_info });
      }
      if (
          rest.is_voluntary &&
          (
              !rest.voluntary_amount ||
              !rest.voluntary_price ||
              !rest.voluntary_seats
          )
      ) {
        throw new Error('Missing required properties');
      }
      if (rest.is_voluntary && !rest.is_combo || !rest.is_voluntary && rest.is_combo) {
        throw new Error('is_combo and is_voluntary must be both property')
      }
      const [nModified, insuranceProducts] =
        await this.insuranceProductRepository.updateById(id, rest);
      if (!nModified) {
        throw new Error('Cannot update insurance product detail');
      }
      return insuranceProducts[0];
    } catch (error) {
      throw error;
    }
  }

  getInsuranceProductByCondition(condition: any): Promise<InsuranceProductModel> {
    return this.insuranceProductRepository.findOneByCondition(condition);
  }
}

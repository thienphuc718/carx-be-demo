import { InsuranceProductModel } from '../../../../models/InsuranceProducts';
import {
  CreateInsuranceProductEntityDto,
  FilterInsuranceProductDto,
  UpdateInsuranceProductPayloadDto,
} from '../../dto/InsuranceProductDto';

export interface InsuranceProductServiceInterface {
  getInsuranceProductList(
    payload: FilterInsuranceProductDto,
  ): Promise<InsuranceProductModel[]>;
  getInsuranceProductListByConditionWithoutPagination(
    condition: any,
  ): Promise<InsuranceProductModel[]>;
  getInsuranceProductDetail(id: string): Promise<InsuranceProductModel>;
  getInsuranceProductByCondition(condition: any): Promise<InsuranceProductModel>;
  createInsuranceProduct(
    payload: CreateInsuranceProductEntityDto,
    userId: string,
  ): Promise<InsuranceProductModel>;
  updateInsuranceProductById(
    id: string,
    payload: UpdateInsuranceProductPayloadDto,
  ): Promise<InsuranceProductModel>;
  deleteInsuranceProduct(id: string): Promise<boolean>;
}

export const InsuranceProductServiceInterface = Symbol(
  'InsuranceProductServiceInterface',
);
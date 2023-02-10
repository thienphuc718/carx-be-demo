import { DistrictModel } from '../../../../models/Districts';
import {
  CreateDistrictDto,
  FilterDistrictDto,
  UpdateDistrictDto,
} from '../../dto/DistrictDto';

export interface IDistrictService {
  getDistrictList(
    payload: FilterDistrictDto,
    schema: string,
  ): Promise<DistrictModel[]>;
  countDistrictByCondition(condition: any, schema: string): Promise<number>;
  getDistrictDetail(id: string, schema: string): Promise<DistrictModel>;
  createDistrict(
    payload: CreateDistrictDto,
    schema: string,
  ): Promise<DistrictModel>;
  updateDistrict(
    id: string,
    payload: UpdateDistrictDto,
    schema: string,
  ): Promise<number>;
  deleteDistrict(id: string, schema: string): Promise<void>;
}

export const IDistrictService = Symbol('IDistrictService');

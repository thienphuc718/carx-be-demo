import { CustomLocationModel } from '../../../models';
import { CreateCustomLocationPayloadDto, FilterCustomLocationDto, UpdateCustomLocationOrderPayloadDto, UpdateCustomLocationPayloadDto } from '../dto/CustomLocationDto';

export interface ICustomLocationService {
  getCustomLocationList(payload: FilterCustomLocationDto): Promise<CustomLocationModel[]>;
  getCustomLocationDetail(id: string): Promise<CustomLocationModel>;
  createCustomLocation(payload: CreateCustomLocationPayloadDto): Promise<CustomLocationModel>;
  updateCustomLocation(id: string, payload: UpdateCustomLocationPayloadDto): Promise<CustomLocationModel>;
  updateCustomLocationOrder(id: string, payload: UpdateCustomLocationOrderPayloadDto): Promise<CustomLocationModel>
  countCustomLocationByCondition(condition: any): Promise<number>;
  deleteCustomLocation(id: string): Promise<boolean>;
}

export const ICustomLocationService = Symbol('ICustomLocationService');

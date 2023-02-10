import { ServiceModel } from '../../../models';
import {
  CreateServicePayloadDto,
  UpdateServicePayloadDto,
  FilterServiceDto,
  ServicePayloadDto,
  AddServiceToCategoryDto,
} from '../dto/ServiceDto';

export interface IServiceService {
  getServiceList(payload: FilterServiceDto): Promise<ServiceModel[]>;
  getServiceByCondition(condition: any): Promise<ServiceModel>;
  countServiceByCondition(condition: any): Promise<number>;
  getServiceDetail(id: string): Promise<ServiceModel>;
  createService(payload: ServicePayloadDto, userId: string): Promise<ServiceModel>;
  updateService(
    id: string,
    payload: ServicePayloadDto,
  ): Promise<ServiceModel>;
  updateServiceCategory(
    serviceIds: string,
    category_ids: string[],
  ): Promise<void>;
  deleteService(id: string): Promise<void>;
  deleteMultiServices(ids: string[]): Promise<void>;
  // addServiceToCategory(payload: AddServiceToCategoryDto): Promise<ServiceModel>;
  getRelatedServices(service_id: string): Promise<[number, ServiceModel[]]>;
  bulkUpload(file: any, userId: string): any;
  getServiceListByConditionWithoutPagination(condition: any): Promise<ServiceModel[]>;
  addViewCount(serviceId: string): Promise<ServiceModel>;
  getMostViewCountService(): Promise<ServiceModel[]>;
  getServiceDetailAndAddViewCount(id: string): Promise<ServiceModel>;
  updateServiceByCondition(condition: any, payload: any);
}

export const IServiceService = Symbol('IServiceService');

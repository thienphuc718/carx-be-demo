import { ServiceCategoryModel } from '../../../../models/ServiceCategories';
import { CreateServiceCategoryDto, FilterServiceCategoryDto, UpdateServiceCategoryDto } from "../../dto/ServiceCategoryDto";

export interface IServiceCategoryService {
    getServiceCategoryList(payload: FilterServiceCategoryDto): Promise<ServiceCategoryModel[]>
    getAllServiceCategory(): Promise<ServiceCategoryModel[]>
    getServiceCategoryDetail(id: string): Promise<ServiceCategoryModel>
    createServiceCategory(payload: CreateServiceCategoryDto): Promise<ServiceCategoryModel>
    updateServiceCategory(id: string, payload: UpdateServiceCategoryDto): Promise<ServiceCategoryModel>
    deleteServiceCategory(id: string): Promise<void>
    countServiceCategoryByCondition(condition: any): Promise<number>;
    getServiceCategoryByCondition(condition: any): Promise<ServiceCategoryModel>
}

export const IServiceCategoryService = Symbol('IServiceCategoryService');

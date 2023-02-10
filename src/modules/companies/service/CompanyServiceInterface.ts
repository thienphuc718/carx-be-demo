import { CompanyModel } from '../../../models/Companies';
import {
  CreateCompanyDto,
  FilterCompanyDto,
  UpdateCompanyDto,
} from '../dto/CompanyDto';

export interface ICompanyService {
  getCompanyList(payload: FilterCompanyDto): Promise<CompanyModel[]>;
  getCompanyDetail(id: string): Promise<CompanyModel>;
  createCompany(payload: CreateCompanyDto): Promise<CompanyModel>;
  updateCompany(
    id: string,
    payload: UpdateCompanyDto,
  ): Promise<[number, CompanyModel[]]>;
  deleteCompany(id: string): Promise<void>;
}

export const ICompanyService = Symbol('ICompanyService');

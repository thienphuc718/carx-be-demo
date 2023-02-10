import { CompanyModel } from '../../../models/Companies';

export interface ICompanyRepository {
  findAll(): Promise<CompanyModel[]>;
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CompanyModel[]>;
  findById(id: string): Promise<CompanyModel>;
  create(payload: any): Promise<CompanyModel>;
  update(id: string, payload: any): Promise<[number, CompanyModel[]]>;
  delete(id: string): void;
}

export const ICompanyRepository = Symbol('ICompanyRepository');

import { Inject, Injectable } from '@nestjs/common';
import { CompanyModel } from '../../../models/Companies';

import {
  FilterCompanyDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from '../dto/CompanyDto';
import { ICompanyRepository } from '../repository/CompanyRepositoryInterface';
import { ICompanyService } from './CompanyServiceInterface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompanyServiceImplementation implements ICompanyService {
  constructor(
    @Inject(ICompanyRepository)
    private companyRepository: ICompanyRepository,
  ) {}

  async getCompanyList(payload: FilterCompanyDto): Promise<CompanyModel[]> {
    try {
      const { limit, offset } = payload;
      const companies = await this.companyRepository.findAllByCondition(
        limit,
        offset,
        {},
      );
      return companies;
    } catch (error) {
      throw error;
    }
  }

  getCompanyDetail(id: string): Promise<CompanyModel> {
    try {
      return this.companyRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createCompany(payload: CreateCompanyDto): Promise<CompanyModel> {
    try {
      const createdCompany = await this.companyRepository.create(payload);
      return createdCompany;
    } catch (error) {
      throw error;
    }
  }

  async updateCompany(
    id: string,
    payload: UpdateCompanyDto,
  ): Promise<[number, CompanyModel[]]> {
    try {
      const updatedCompany = await this.companyRepository.update(id, payload);
      return updatedCompany;
    } catch (error) {
      throw error;
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      const company = await this.getCompanyDetail(id);
      if (!company) {
        throw new Error('Company not found');
      }
      this.companyRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}

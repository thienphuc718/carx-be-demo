import { Inject, Injectable } from '@nestjs/common';
import { IServiceTemplateService } from './ServiceTemplateServiceInterface';
import { GetListServiceTemplateDto } from '../../dto/ServiceTemplateDto';
import { ServiceTemplateModel } from '../../../../models/ServiceTemplates';
import { IServiceTemplateRepository } from '../../repository/service-templates/ServiceTemplateRepositoryInterface';
import { removeVietnameseTones } from '../../../../helpers/stringHelper';
import { Op } from 'sequelize';

@Injectable()
export class ServiceTemplateServiceImplementation
  implements IServiceTemplateService
{
  constructor(
    @Inject(IServiceTemplateRepository)
    private serviceTemplateRepository: IServiceTemplateRepository,
  ) {}

  async getTemplateList(
    payload: GetListServiceTemplateDto,
  ): Promise<ServiceTemplateModel[]> {
    try {
      let limit, page, keyword;
      if (payload) {
        limit = payload.limit;
        page = payload.page;
        keyword = payload.keyword;
      };
      let condition = {};
      if (keyword) {
        const searchArray = removeVietnameseTones(keyword).split(' ');
        condition = { search: { [Op.overlap]: searchArray } };
      }
      if (payload.category_id) {
        condition["category_id"] = payload.category_id;
      }
      const templates = await this.serviceTemplateRepository.findAllByCondition(
        limit || undefined,
        limit && page ? (page - 1) * limit : undefined,
        condition,
      );
      return templates;
    } catch (error) {
      throw error;
    }
  }

  async countTemplateByKeyword(payload: any): Promise<number> {
    try {
      let condition = {};
      if (payload && payload.keyword) {
        const searchArray = removeVietnameseTones(payload.keyword).split(' ');
        condition = { search: { [Op.overlap]: searchArray } };
      }
      if (payload && payload.category_id) {
        condition["category_id"] = payload.category_id;
      }
      const count = await this.serviceTemplateRepository.countByKeyword(
        condition,
      );
      return count;
    } catch (error) {
      throw error;
    }
  }
}

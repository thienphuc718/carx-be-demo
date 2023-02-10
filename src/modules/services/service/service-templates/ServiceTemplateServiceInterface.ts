import { ServiceTemplateModel } from '../../../../models/ServiceTemplates';
import { GetListServiceTemplateDto } from '../../dto/ServiceTemplateDto';

export interface IServiceTemplateService {
  getTemplateList(
    payload: GetListServiceTemplateDto,
  ): Promise<ServiceTemplateModel[]>;

  countTemplateByKeyword(payload: any): Promise<number>;
}

export const IServiceTemplateService = Symbol('IServiceTemplateService');

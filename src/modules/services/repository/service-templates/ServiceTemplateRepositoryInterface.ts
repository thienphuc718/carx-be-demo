import { ServiceTemplateModel } from '../../../../models/ServiceTemplates';

export interface IServiceTemplateRepository {
  findAllByCondition(
    limit: number | undefined,
    offset: number | undefined,
    condition: any,
  ): Promise<ServiceTemplateModel[]>;

  countByKeyword(condition: any): Promise<number>;
}

export const IServiceTemplateRepository = Symbol('IServiceTemplateRepository');

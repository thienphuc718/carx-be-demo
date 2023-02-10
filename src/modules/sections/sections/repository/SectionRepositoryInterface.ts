import { SectionModel } from '../../../../models';

export interface ISectionRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<SectionModel[]>;
  findById(id: string): Promise<SectionModel>;
  updateById(id: string, payload: any): Promise<[number, SectionModel[]]>;
  countByCondition(condition: any): Promise<number>;
  findOneByCondition(condition: any): Promise<SectionModel>
}

export const ISectionRepository = Symbol('ISectionRepository');

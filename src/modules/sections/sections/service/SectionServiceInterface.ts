import { SectionModel } from '../../../../models';
import {
  FilterSectionDto,
  UpdateSectionDto,
  UpdateSectionOrderDto,
} from '../dto/SectionDto';

export interface ISectionService {
  getSectionListByCondition(condition: FilterSectionDto): Promise<SectionModel[]>;
  getSectionDetail(id: string): Promise<SectionModel & { items: Array<any> }>
  updateSectionById(id: string, payload: UpdateSectionDto): Promise<SectionModel>;
  updateSectionOrder(
    id: string,
    payload: UpdateSectionOrderDto,
  ): Promise<SectionModel>;
  countByCondition(condition: any): Promise<number>;
  getSectionDetailByCondition(condition: any): Promise<SectionModel>;
}

export const ISectionService = Symbol('ISectionService');

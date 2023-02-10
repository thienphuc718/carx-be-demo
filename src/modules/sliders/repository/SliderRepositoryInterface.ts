import { SliderModel } from '../../../models';

export interface ISliderRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<SliderModel[]>;
  findById(id: string): Promise<SliderModel>;
  create(payload: any): Promise<SliderModel>;
  update(id: string, payload: any): Promise<[number, SliderModel[]]>;
  count(condition: any): Promise<number>;
  delete(id: string): Promise<number>;
  findOneByCondition(condition: any): Promise<SliderModel>
  findAllByConditionWithoutPagination(condition: any): Promise<SliderModel[]>
  rawQuery(query: string): any
}

export const ISliderRepository = Symbol('ISliderRepository');

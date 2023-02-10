import { PopUpModel } from '../../../models';

export interface IPopUpRepository {
  findAll(): Promise<PopUpModel[]>;
  update(id: string, payload: any): Promise<[number, PopUpModel[]]>;
  delete(id: string): Promise<number>;
  create(payload: any): Promise<PopUpModel>;
  findById(id: string): Promise<PopUpModel>;
  countByCondition(condition: any): Promise<number>;
}

export const IPopUpRepository = Symbol('IPopUpRepository');

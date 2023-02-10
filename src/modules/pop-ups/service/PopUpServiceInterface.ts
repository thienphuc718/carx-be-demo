import { PopUpModel } from '../../../models';
import { CreatePopUpPayloadDto } from '../dto/PopUpDto';

export interface IPopUpService {
  getPopUpList(): Promise<PopUpModel[]>;
  updatePopUp(id: string, payload: any): Promise<PopUpModel>;
  createPopUp(payload: CreatePopUpPayloadDto): Promise<PopUpModel>;
  deletePopUpById(id: string): Promise<boolean>;
  countPopUpByCondition(condition: any): Promise<number>;
}

export const IPopUpService = Symbol('IPopUpService');

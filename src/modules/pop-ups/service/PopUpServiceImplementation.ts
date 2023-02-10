import { Inject } from '@nestjs/common';
import { PopUpModel } from '../../../models';
import { CreatePopUpPayloadDto } from '../dto/PopUpDto';
import { IPopUpRepository } from '../repository/PopUpRepositoryInterface';
import { IPopUpService } from './PopUpServiceInterface';

export class PopUpServiceImplementation implements IPopUpService {
  constructor(
    @Inject(IPopUpRepository) private popUpRepository: IPopUpRepository,
  ) {}
  getPopUpList(): Promise<PopUpModel[]> {
    return this.popUpRepository.findAll();
  }
  async updatePopUp(id: string, payload: any): Promise<PopUpModel> {
    try {
      const [nModified, popUps] = await this.popUpRepository.update(
        id,
        payload,
      );
      if (!nModified) {
        throw new Error(`Cannot update slider`);
      }
      const updatedPopUp = popUps[0];
      return updatedPopUp;
    } catch (error) {
      throw error;
    }
  }
  async createPopUp(payload: CreatePopUpPayloadDto): Promise<PopUpModel> {
    try {
      const popUps = await this.getPopUpList();
      if (popUps.length >= 1) {
        throw new Error(`Maximum capacity exceeded`);
      }
      return this.popUpRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }
  async deletePopUpById(id: string): Promise<boolean> {
    try {
      const popUp = await this.popUpRepository.findById(id);
      if (!popUp) {
        throw new Error('PopUp not found');
      }
      const nDeleted = await this.popUpRepository.delete(popUp.id);
      return !!nDeleted;
    } catch (error) {
      throw error;
    }
  }
  countPopUpByCondition(condition: any): Promise<number> {
    return this.popUpRepository.countByCondition(condition);
  }
}

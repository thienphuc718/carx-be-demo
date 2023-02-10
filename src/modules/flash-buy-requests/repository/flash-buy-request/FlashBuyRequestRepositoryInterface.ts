import { FlashBuyRequestModel } from '../../../../models';

export interface IFlashBuyRequestRepository {
  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<FlashBuyRequestModel[]>;
  findById(id: string): Promise<FlashBuyRequestModel>;
  countByCondition(condition: any): Promise<number>
  create(payload: any): Promise<FlashBuyRequestModel>;
  update(id: string, payload: any): Promise<[number, FlashBuyRequestModel[]]>;
  delete(id: string): void;
  findOneByCondition(condition: any): Promise<FlashBuyRequestModel>;
}

export const IFlashBuyRequestRepository = Symbol('IFlashBuyRequestRepository');
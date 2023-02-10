import { FlashBuyResponseModel } from "../../../../models";

export interface IFlashBuyResponseRepository {
    findAllWithCondition(limit: number, offset: number, condition: any): Promise<FlashBuyResponseModel[]>
    create(payload: any): Promise<FlashBuyResponseModel>
    // update(condition: UpdateFlashBuyResponseConditionDto, payload: { is_deleted: boolean }): Promise<[number, FlashBuyResponseModel[]]>
    count(condition: any): Promise<number>
    findAllByConditionWithoutPagination(condition: any): Promise<FlashBuyResponseModel[]>
    findOneByCondition(condition: any): Promise<FlashBuyResponseModel>
}

export const IFlashBuyResponseRepository = Symbol(
  'IFlashBuyResponseRepository',
);

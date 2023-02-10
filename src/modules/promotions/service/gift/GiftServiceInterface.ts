import { GiftModel } from '../../../../models';
import { CreateGiftDto, FilterGiftDto, UpdateGiftDto } from "../../dto/GiftDto";

export interface IGiftService {
    getGiftList(payload: FilterGiftDto): Promise<GiftModel[]>
    getGiftByCondition(condition: any): Promise<GiftModel>
    countGiftByCondition(condition: any): Promise<number>
    getGiftDetail(id: string): Promise<GiftModel>
    createGift(payload: CreateGiftDto): Promise<GiftModel>
    updateGift(id: string, payload: UpdateGiftDto): Promise<number>
    deleteGift(id: string): Promise<void>
}

export const IGiftService = Symbol('IGiftService');

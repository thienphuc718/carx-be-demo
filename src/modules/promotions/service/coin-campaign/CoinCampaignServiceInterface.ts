import { CoinCampaignModel } from '../../../../models';
import { CreateCoinCampaignDto, FilterCoinCampaignDto, UpdateCoinCampaignDto } from "../../dto/CoinCampaignDto";

export interface ICoinCampaignService {
    getCoinCampaignList(payload: FilterCoinCampaignDto): Promise<CoinCampaignModel[]>
    getCoinCampaignByCondition(condition: any): Promise<CoinCampaignModel>
    countCoinCampaignByCondition(condition: any): Promise<number>
    getCoinCampaignDetail(id: string): Promise<CoinCampaignModel>
    createCoinCampaign(payload: CreateCoinCampaignDto): Promise<CoinCampaignModel>
    updateCoinCampaign(id: string, payload: UpdateCoinCampaignDto): Promise<number>
    deleteCoinCampaign(id: string): Promise<void>
}

export const ICoinCampaignService = Symbol('ICoinCampaignService');

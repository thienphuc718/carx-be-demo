import { CoinConfigModel } from '../../../../models';
import { CreateCoinConfigDto, FilterCoinConfigDto, UpdateCoinConfigDto } from "../../dto/CoinConfigDto";

export interface ICoinConfigService {
    getCoinConfigList(payload: FilterCoinConfigDto): Promise<CoinConfigModel[]>
    getCoinConfigByCondition(condition: any): Promise<CoinConfigModel>
    countCoinConfigByCondition(condition: any): Promise<number>
    getCoinConfigDetail(id: string): Promise<CoinConfigModel>
    createCoinConfig(payload: CreateCoinConfigDto): Promise<CoinConfigModel>
    updateCoinConfig(id: string, payload: UpdateCoinConfigDto): Promise<number>
    deleteCoinConfig(id: string): Promise<void>
}

export const ICoinConfigService = Symbol('ICoinConfigService');

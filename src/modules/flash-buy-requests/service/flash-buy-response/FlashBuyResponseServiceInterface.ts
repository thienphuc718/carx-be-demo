import { FlashBuyResponseModel } from '../../../../models';
import {
  CreateFlashBuyResponseDto,
  CreateRejectedFlashBuyResponse,
  FilterFlashBuyResponseDto,
} from '../../dto/FlashBuyResponseDto';

export interface IFlashBuyResponseService {
  getFlashBuyResponseList(
    payload: FilterFlashBuyResponseDto,
  ): Promise<FlashBuyResponseModel[]>;
  createFlashBuyResponse(
    payload: CreateFlashBuyResponseDto,
    userId: string,
  ): Promise<FlashBuyResponseModel>;
  createRejectedFlashBuyResponse(
    payload: CreateRejectedFlashBuyResponse,
  ): Promise<FlashBuyResponseModel>;
  countFlashBuyResponseByCondition(condition: any): Promise<number>;
  getFlashBuyResponseListByCondition(condition: any): Promise<FlashBuyResponseModel[]>
}

export const IFlashBuyResponseService = Symbol(
  'IFlashBuyResponseService',
);

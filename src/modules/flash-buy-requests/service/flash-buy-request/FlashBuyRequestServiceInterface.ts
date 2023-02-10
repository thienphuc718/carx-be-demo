import { FlashBuyRequestModel } from '../../../../models';
import {
  CreateFlashBuyRequestDto,
  FilterFlashBuyRequestDto,
  UpdateFlashBuyRequestDto,
} from '../../dto/FlashBuyRequestDto';

export interface IFlashBuyRequestService {
  getAllFlashBuyRequests(
    payload: FilterFlashBuyRequestDto,
  ): Promise<FlashBuyRequestModel[]>;
  getFlashBuyRequestDetail(id: string): Promise<FlashBuyRequestModel>;
  createFlashBuyRequest(
    payload: CreateFlashBuyRequestDto,
  ): Promise<FlashBuyRequestModel>;
  updateFlashBuyRequest(
    id: string,
    payload: UpdateFlashBuyRequestDto,
  ): Promise<FlashBuyRequestModel>;
  deleteFlashBuyRequest(id: string): void;
  countFlashBuyRequestByCondition(condition: any): Promise<number>;
  getFlashBuyRequestDetailByCondition(condition: any): Promise<FlashBuyRequestModel>;
  getNumberNotYetResponsesFlashBuyRequestByAgentId(agent_id: string): Promise<number>;
}

export const IFlashBuyRequestService = Symbol('IFlashBuyRequestService');

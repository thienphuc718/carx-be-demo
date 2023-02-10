import { OnsiteRescueResponseModel } from '../../../../models';
import {
  CreateOnsiteRescueResponseDto,
  FilterOnsiteRescueResponseDto,
  UpdateOnsiteRescueResponseDto,
} from '../../dto/OnsiteRescueResponseDto';

export interface IOnsiteRescueResponseService {
  getOnsiteRescueResponseList(
    payload: FilterOnsiteRescueResponseDto,
  ): Promise<OnsiteRescueResponseModel[]>;
  getOnsiteRescueResponseDetail(id: string): Promise<OnsiteRescueResponseModel>;
  createOnsiteRescueResponse(
    payload: CreateOnsiteRescueResponseDto,
  ): Promise<OnsiteRescueResponseModel>;
  updateOnsiteRescueResponse(
    id: string,
    payload: UpdateOnsiteRescueResponseDto,
  ): Promise<OnsiteRescueResponseModel>;
  countOnsiteRescueResponseByCondition(condition: any): Promise<number>
  getOneOnsiteRescueResponseByCondition(condition: any): Promise<OnsiteRescueResponseModel>
  createRejectedOnsiteRescueResponse(payload: CreateOnsiteRescueResponseDto): Promise<OnsiteRescueResponseModel>
  getOnsiteRescueResponseByConditionWithoutPagination(condition: any): Promise<OnsiteRescueResponseModel[]>
}

export const IOnsiteRescueResponseService = Symbol(
  'IOnsiteRescueResponseService',
);

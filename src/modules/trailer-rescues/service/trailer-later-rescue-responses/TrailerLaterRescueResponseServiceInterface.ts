import { TrailerLaterRescueResponseModel } from '../../../../models';
import {
  CreateRejectedTrailerLaterRescueResponseDto,
  CreateTrailerLaterRescueResponseDto,
  FilterTrailerLaterRescueResponseDto,
  UpdateTrailerLaterRescueResponseDto,
} from '../../dto/TrailerLaterRescueResponseDto';

export interface ITrailerLaterRescueResponseService {
  getTrailerLaterRescueResponseList(
    payload: FilterTrailerLaterRescueResponseDto,
  ): Promise<TrailerLaterRescueResponseModel[]>;
  getTrailerLaterRescueResponseDetail(id: string): Promise<TrailerLaterRescueResponseModel>;
  createTrailerLaterRescueResponse(
    payload: CreateTrailerLaterRescueResponseDto,
  ): Promise<TrailerLaterRescueResponseModel>;
  updateTrailerLaterRescueResponse(
    id: string,
    payload: UpdateTrailerLaterRescueResponseDto,
  ): Promise<TrailerLaterRescueResponseModel>;
  countTrailerLaterRescueResponseByCondition(condition: any): Promise<number>
  getOneTrailerLaterRescueResponseByCondition(condition: any): Promise<TrailerLaterRescueResponseModel>
  createRejectedTrailerLaterRescueResponse(payload: CreateRejectedTrailerLaterRescueResponseDto): Promise<TrailerLaterRescueResponseModel>
  getTrailerLaterRescueResponseByConditionWithoutPagination(condition: any): Promise<TrailerLaterRescueResponseModel[]>
}

export const ITrailerLaterRescueResponseService = Symbol(
  'ITrailerLaterRescueResponseService',
);

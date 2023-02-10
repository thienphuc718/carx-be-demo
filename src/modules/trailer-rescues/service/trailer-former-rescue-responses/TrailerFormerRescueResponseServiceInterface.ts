import { TrailerFormerRescueResponseModel } from '../../../../models';
import {
  CreateTrailerFormerRescueResponseDto,
  FilterTrailerFormerRescueResponseDto,
  UpdateTrailerFormerRescueResponseDto,
} from '../../dto/TrailerFormerRescueResponseDto';

export interface ITrailerFormerRescueResponseService {
  getTrailerFormerRescueResponseList(
    payload: FilterTrailerFormerRescueResponseDto,
  ): Promise<TrailerFormerRescueResponseModel[]>;
  getTrailerFormerRescueResponseDetail(id: string): Promise<TrailerFormerRescueResponseModel>;
  createTrailerFormerRescueResponse(
    payload: CreateTrailerFormerRescueResponseDto,
  ): Promise<TrailerFormerRescueResponseModel>;
  updateTrailerFormerRescueResponse(
    id: string,
    payload: UpdateTrailerFormerRescueResponseDto,
  ): Promise<TrailerFormerRescueResponseModel>;
  countTrailerFormerRescueResponseByCondition(condition: any): Promise<number>
  getOneTrailerFormerRescueResponseByCondition(condition: any): Promise<TrailerFormerRescueResponseModel>
  createRejectedTrailerFormerRescueResponse(payload: CreateTrailerFormerRescueResponseDto): Promise<TrailerFormerRescueResponseModel>
  getTrailerFormerRescueResponseByConditionWithoutPagination(condition: any): Promise<TrailerFormerRescueResponseModel[]>
}

export const ITrailerFormerRescueResponseService = Symbol(
  'ITrailerFormerRescueResponseService',
);

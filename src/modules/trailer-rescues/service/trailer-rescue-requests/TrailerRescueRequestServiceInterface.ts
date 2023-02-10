import { TrailerRescueRequestModel, TrailerFormerRescueResponseModel } from '../../../../models';
import {
  CreateTrailerRescueRequestDto,
  FilterTrailerRescueRequestDto,
  UpdateTrailerRescueRequestDto,
} from '../../dto/TrailerRescueRequestDto';

export interface ITrailerRescueRequestService {
  getTrailerRescueRequestList(
    payload: FilterTrailerRescueRequestDto,
  ): Promise<Array<TrailerRescueRequestModel & { response?: TrailerFormerRescueResponseModel }>>;
  getTrailerRescueRequestDetail(id: string): Promise<TrailerRescueRequestModel>;
  getCurrentTrailerRescueRequest(customerId: string): Promise<TrailerRescueRequestModel>;
  getTrailerRescueRequestByCondition(condition: any): Promise<TrailerRescueRequestModel>;
  createTrailerRescueRequest(
    payload: CreateTrailerRescueRequestDto,
  ): Promise<TrailerRescueRequestModel>;
  updateTrailerRescueRequest(
    id: string,
    payload: UpdateTrailerRescueRequestDto,
  ): Promise<TrailerRescueRequestModel>;
  countTrailerRescueRequestByCondition(condition: any): Promise<number>;
  getNotYetResponseTrailerRescueRequestByAgentId(agent_id: string): Promise<number>;
}

export const ITrailerRescueRequestService = Symbol(
  'ITrailerRescueRequestService',
);

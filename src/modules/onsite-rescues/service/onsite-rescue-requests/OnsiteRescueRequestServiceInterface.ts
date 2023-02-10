import { OnsiteRescueRequestModel, OnsiteRescueResponseModel } from '../../../../models';
import {
  CreateOnsiteRescueRequestDto,
  FilterOnsiteRescueRequestDto,
  UpdateOnsiteRescueRequestDto,
} from '../../dto/OnsiteRescueRequestDto';

export interface IOnsiteRescueRequestService {
  getOnsiteRescueRequestList(
    payload: FilterOnsiteRescueRequestDto,
  ): Promise<Array<OnsiteRescueRequestModel & { response?: OnsiteRescueResponseModel }>>;
  getOnsiteRescueRequestDetail(id: string): Promise<OnsiteRescueRequestModel>;
  getCurrentOnsiteRescueRequest(customerId: string): Promise<OnsiteRescueRequestModel>;
  getOnsiteRescueRequestByCondition(condition: any): Promise<OnsiteRescueRequestModel>;
  createOnsiteRescueRequest(
    payload: CreateOnsiteRescueRequestDto,
  ): Promise<OnsiteRescueRequestModel>;
  updateOnsiteRescueRequest(
    id: string,
    payload: UpdateOnsiteRescueRequestDto,
  ): Promise<OnsiteRescueRequestModel>;
  countOnsiteRescueRequestByCondition(condition: any): Promise<number>;
  getNotYetResponseOnsiteRescueRequestByAgentId(agent_id: string): Promise<number>;
}

export const IOnsiteRescueRequestService = Symbol(
  'IOnsiteRescueRequestService',
);

import { AgentModel } from '../../../models';
import { FilterAgentDto, UpdateAgentEntityDto } from '../dto/AgentDto';

export interface IAgentService {
  getAgentDetails(id: string): Promise<AgentModel>;
  updateAgent(
    id: string,
    payload: UpdateAgentEntityDto,
  ): Promise<[number, AgentModel[]]>;
  getAgentList(payload: FilterAgentDto): Promise<AgentModel[]>;
  getAgentListWithoutPaging(condition: any): Promise<AgentModel[]>;
  getAgentListByDistance(payload: FilterAgentDto);
  countAgentByCondition(condition: Record<string, any>): Promise<number>;
  countAgentByDistance(condition: Record<string, any>): Promise<number>;
  updateGeoLocation(agentId: string, address: string): Promise<void>;
  hideOrUnhideAgent(agentId: string, isHidden: boolean): Promise<boolean>
  getAgentRevenue(agentId: string): Promise<any>;
  getAgentDetailByCondition(condition: any): Promise<AgentModel>;
  activateOrDeactivateAgent(agentId: string, isActivated: boolean): Promise<boolean>;
  getAgentListByDistanceWithoutPagination(condition: any): Promise<AgentModel[]>;
  deleteAgent(agentId: string);
}

export const IAgentService = Symbol('IAgentService');

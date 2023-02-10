import { ReferralLinkModel } from '../../../../models';
import { CreateReferralLinkDto, FilterReferralLinkDto, UpdateReferralLinkDto } from "../../dto/ReferralLinkDto";

export interface IReferralLinkService {
    getReferralLinkList(payload: FilterReferralLinkDto): Promise<ReferralLinkModel[]>
    getReferralLinkByCondition(condition: any): Promise<ReferralLinkModel>
    countReferralLinkByCondition(condition: any): Promise<number>
    getReferralLinkDetail(id: string): Promise<ReferralLinkModel>
    createReferralLink(payload: CreateReferralLinkDto): Promise<ReferralLinkModel>
    updateReferralLink(id: string, payload: UpdateReferralLinkDto): Promise<number>
    deleteReferralLink(id: string): Promise<void>
}

export const IReferralLinkService = Symbol('IReferralLinkService');

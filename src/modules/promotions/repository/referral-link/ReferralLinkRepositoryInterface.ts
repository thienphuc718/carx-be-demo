import { ReferralLinkModel } from '../../../../models';

export interface IReferralLinkRepository {
  findAll(): Promise<ReferralLinkModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<ReferralLinkModel[]>;
  findOneByCondition(condition: any): Promise<ReferralLinkModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<ReferralLinkModel>;
  create(payload: any): Promise<ReferralLinkModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IReferralLinkRepository = Symbol('IReferralLinkRepository');

import { Inject } from '@nestjs/common';
import { ReferralLinkModel } from '../../../../models';
import {
  FilterReferralLinkDto,
  CreateReferralLinkDto,
  UpdateReferralLinkDto,
} from '../../dto/ReferralLinkDto';

import { IReferralLinkService } from './ReferralLinkServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { IReferralLinkRepository } from '../../repository/referral-link/ReferralLinkRepositoryInterface';

export class ReferralLinkServiceImplementation implements IReferralLinkService {
  constructor(
    @Inject(IReferralLinkRepository)
    private readonly referralLinkRepository: IReferralLinkRepository,
  ) {}

  async getReferralLinkList(
    payload: FilterReferralLinkDto,
  ): Promise<ReferralLinkModel[]> {
    const { limit, page } = payload;
    const postCategories = await this.referralLinkRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
    );
    return postCategories;
  }
  getReferralLinkByCondition(condition: any): Promise<ReferralLinkModel> {
    return this.referralLinkRepository.findOneByCondition(condition);
  }
  countReferralLinkByCondition(condition: any): Promise<number> {
    return this.referralLinkRepository.countByCondition(condition);
  }
  getReferralLinkDetail(id: string): Promise<ReferralLinkModel> {
    return this.referralLinkRepository.findById(id);
  }
  async createReferralLink(
    payload: CreateReferralLinkDto,
  ): Promise<ReferralLinkModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload,
    };
    const createdReferralLink = await this.referralLinkRepository.create(
      params,
    );
    return createdReferralLink;
  }
  async updateReferralLink(
    id: string,
    payload: UpdateReferralLinkDto,
  ): Promise<number> {
    const updatedReferralLink = await this.referralLinkRepository.update(
      id,
      payload,
    );
    return updatedReferralLink;
  }
  async deleteReferralLink(id: string): Promise<void> {
    const referralLink = await this.getReferralLinkDetail(id);
    if (!referralLink) {
      throw new Error('Post Category not found');
    }
    this.referralLinkRepository.delete(id);
  }
}

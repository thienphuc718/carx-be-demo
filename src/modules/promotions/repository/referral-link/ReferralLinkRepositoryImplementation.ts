import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReferralLinkModel } from '../../../../models';
import { IReferralLinkRepository } from './ReferralLinkRepositoryInterface';

@Injectable()
export class ReferralLinkRepositoryImplementation implements IReferralLinkRepository {
  constructor(
    @InjectModel(ReferralLinkModel) private referralLinkModel: typeof ReferralLinkModel,
  ) {}
  findAll(): Promise<ReferralLinkModel[]> {
    return this.referralLinkModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,    
  ): Promise<ReferralLinkModel[]> {
    return this.referralLinkModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  findOneByCondition(
    condition: any,
  ): Promise<ReferralLinkModel> {
    return this.referralLinkModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.referralLinkModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<ReferralLinkModel> {
    return this.referralLinkModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<ReferralLinkModel> {
    return this.referralLinkModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.referralLinkModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.referralLinkModel.update({ is_deleted: false }, { where: { id: id } });
  }
}

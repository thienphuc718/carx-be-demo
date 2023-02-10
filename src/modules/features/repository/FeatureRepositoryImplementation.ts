import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FeatureModel } from '../../../models/Features';
import { IFeatureRepository } from './FeatureRepositoryInterface';

@Injectable()
export class FeatureRepositoryImplementation implements IFeatureRepository {
  constructor(
    @InjectModel(FeatureModel) private featureModel: typeof FeatureModel,
  ) {}

  findAll(): Promise<FeatureModel[]> {
    return this.featureModel.findAll({ where: { is_deleted: false } });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { FeatureModel } from '../../../models/Features';
import { IFeatureRepository } from '../repository/FeatureRepositoryInterface';
import { IFeatureService } from './FeatureServiceInterface';

@Injectable()
export class FeatureServiceImplementation implements IFeatureService {
  constructor(
    @Inject(IFeatureRepository) private featureRepository: IFeatureRepository,
  ) {}

  async getAllFeature(): Promise<FeatureModel[]> {
    try {
      const features = await this.featureRepository.findAll();
      return features;
    } catch (error) {
      throw error;
    }
  }
}

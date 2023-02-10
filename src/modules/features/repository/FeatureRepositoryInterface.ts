import { FeatureModel } from '../../../models/Features';

export interface IFeatureRepository {
  findAll(): Promise<FeatureModel[]>;
}
export const IFeatureRepository = Symbol('IFeatureRepository');

import { FeatureModel } from '../../../models/Features';

export interface IFeatureService {
  getAllFeature(): Promise<FeatureModel[]>;
}
export const IFeatureService = Symbol('IFeatureService');

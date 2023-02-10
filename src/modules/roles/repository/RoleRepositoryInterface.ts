import { RoleFeatureRelationModel } from '../../../models';
import { RoleModel } from '../../../models/Roles';

export interface IRoleRepository {
  findAll(): Promise<RoleModel[]>;
  findAllByCondition(
    limit: number,
    page: number,
    condition: any,
  ): Promise<RoleModel[]>;
  findById(id: string): Promise<RoleModel>;
  create(payload: any): Promise<RoleModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
  bulkCreateRoleFeatures(payload: any): Promise<RoleFeatureRelationModel[]>;
  deleteRoleFeature(condition: any): Promise<number>;
  countByCondition(condition: any): Promise<number>;
}

export const IRoleRepository = Symbol('IRoleRepository');

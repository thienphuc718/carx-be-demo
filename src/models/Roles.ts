import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserModel } from '.';

import { CompanyModel } from './Companies';
import { FeatureModel } from './Features';
import { RoleFeatureRelationModel } from './RoleFeatureRelations';

@Table({
  modelName: 'roles',
})
export class RoleModel extends Model<RoleModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.UUID,
  })
  company_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.STRING,
  })
  converted_name: string;

  @Column({
    type: DataType.TSVECTOR,
  })
  tsv_converted_name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => CompanyModel, 'company_id')
  company: CompanyModel;

  @BelongsToMany(() => FeatureModel, () => RoleFeatureRelationModel)
  role_feature: RoleFeatureRelationModel[];

  @HasMany(() => RoleFeatureRelationModel, 'role_id')
  permissions: RoleFeatureRelationModel[];

  @HasMany(() => UserModel)
  users: UserModel[];

  transformToResponse() {
    try {
      const { permissions, converted_name, tsv_converted_name, ...details } = JSON.parse(JSON.stringify(this));
      const role = { ...details };
      role.permissions = permissions.map((permission) => ({
        role_id: permission.role_id,
        role_name: permission.role.name,
        feature_id: permission.feature_id,
        feature_name: permission.feature.name,
      }));
      return role;
    } catch (error) {
      throw error;
    }
  }
}

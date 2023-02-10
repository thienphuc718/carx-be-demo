import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { CARX_MODULES } from '../constants';
import { RoleFeatureRelationModel } from './RoleFeatureRelations';
import { RoleModel } from './Roles';

@Table({
  modelName: 'features',
})
export class FeatureModel extends Model<FeatureModel> {
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
    type: DataType.STRING,
  })
  slug: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  module: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsToMany(() => RoleModel, () => RoleFeatureRelationModel)
  role_feature: RoleFeatureRelationModel[];

  transformToResponse() {
    try {
      let { id, name, slug, module } = JSON.parse(JSON.stringify(this));
      return { id, name, slug, module };
    } catch (error) {
      throw error;
    }
  }
}

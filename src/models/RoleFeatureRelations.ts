import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { FeatureModel } from '.';
import { RoleModel } from './Roles';

@Table({
  modelName: 'role_feature_relations',
})
export class RoleFeatureRelationModel extends Model<RoleFeatureRelationModel> {
  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  role_id: string;

  @ForeignKey(() => FeatureModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  feature_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => RoleModel)
  role: RoleModel;

  @BelongsTo(() => FeatureModel)
  feature: FeatureModel;
}

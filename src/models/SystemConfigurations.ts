import {
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'system_configurations',
})
export class SystemConfigurationModel extends Model<SystemConfigurationModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  // Value used for calculations
  @Column({
    type: DataType.INTEGER,
  })
  apply_value: number;

  @Column({
    type: DataType.STRING,
  })
  apply_unit: string;

  // Value used for comparison
  @Column({
    type: DataType.INTEGER,
  })
  compare_value: number;

  @Column({
    type: DataType.STRING,
  })
  compare_unit: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_enabled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

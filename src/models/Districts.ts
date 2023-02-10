import { CityModel } from './Cities';
import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Table({
  modelName: 'districts',
})
export class DistrictModel extends Model<DistrictModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @ForeignKey(() => CityModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city_id: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => CityModel)
  city: CityModel;
}

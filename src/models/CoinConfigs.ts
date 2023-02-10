import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'coin-configs',
})
export class CoinConfigModel extends Model<CoinConfigModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  object_name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  object_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  valid_date: number;

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

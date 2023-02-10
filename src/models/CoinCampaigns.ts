import {
  Column,
  CreatedAt,
  DataType,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';

export class CoinCampaignModel extends Model<CoinCampaignModel> {
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  end_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  factor: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  value: number;

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
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

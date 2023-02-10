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
  modelName: 'recommended_keywords',
})
export class RecommendedKeywordModel extends Model<RecommendedKeywordModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  keyword: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

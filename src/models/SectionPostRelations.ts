import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { PostModel } from './Posts';
import { SectionModel } from './Sections';

@Table({
  modelName: 'section_post_relations',
})
export class SectionPostRelationModel extends Model<SectionPostRelationModel> {
  @PrimaryKey
  @ForeignKey(() => SectionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  section_id: string;

  @PrimaryKey
  @ForeignKey(() => PostModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  post_id: string;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  order: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => PostModel, 'post_id')
  post: PostModel;

  @BelongsTo(() => SectionModel, 'section_id')
  section: SectionModel;
}

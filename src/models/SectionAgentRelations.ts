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
import { AgentModel } from '.';
import { SectionModel } from './Sections';

@Table({
  modelName: 'section_agent_relations',
})
export class SectionAgentRelationModel extends Model<SectionAgentRelationModel> {
  @PrimaryKey
  @ForeignKey(() => SectionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  section_id: string;

  @PrimaryKey
  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  agent_id: string;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  order: number;

  @BelongsTo(() => SectionModel, 'section_id')
  section: SectionModel;

  @BelongsTo(() => AgentModel, 'agent_id')
  agent: AgentModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

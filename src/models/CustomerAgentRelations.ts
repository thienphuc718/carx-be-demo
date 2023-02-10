import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AgentModel } from '.';
import { CustomerModel } from './Customers';

@Table({
  modelName: 'customer_agent_relations',
})
export class CustomerAgentRelationsModel extends Model<CustomerAgentRelationsModel> {
  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  agent_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @BelongsTo(() => AgentModel)
  agent: AgentModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

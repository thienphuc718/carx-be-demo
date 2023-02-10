import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { AgentModel, ProductModel, ServiceModel } from '.';

@Table({
  tableName: 'agent_categories',
})
export class AgentCategoryModel extends Model<AgentCategoryModel> {
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
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobile_screen: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  show_on_homepage: boolean;

  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  order: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasMany(() => AgentModel)
  agents: AgentModel[];

  @HasMany(() => ServiceModel, 'agent_category_id')
  services: ServiceModel[];

  @HasMany(() => ProductModel, 'agent_category_id')
  products: ProductModel[];
}

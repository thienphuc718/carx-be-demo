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
import { ServiceCategoryModel } from './ServiceCategories';

@Table({
  modelName: 'service_templates',
})
export class ServiceTemplateModel extends Model<ServiceTemplateModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => ServiceCategoryModel)
  @Column({
    type: DataType.UUID,
  })
  category_id: string;

  @Column({
    type: DataType.STRING,
  })
  template: string;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
  })
  search: string[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ServiceCategoryModel, 'category_id')
  category: ServiceCategoryModel;
}

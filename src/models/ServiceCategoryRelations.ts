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
import { ServiceCategoryModel } from './ServiceCategories';
import { ServiceModel } from './Services';

@Table({
  modelName: 'service_category_relations',
})
export class ServiceCategoryRelationModel extends Model<ServiceCategoryRelationModel> {
  @PrimaryKey
  @ForeignKey(() => ServiceModel)
  @Column
  service_id: string;

  @PrimaryKey
  @ForeignKey(() => ServiceCategoryModel)
  @Column
  category_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => ServiceCategoryModel)
  category_details: ServiceCategoryModel;

  @BelongsTo(() => ServiceModel)
  service_details: ServiceModel;
}

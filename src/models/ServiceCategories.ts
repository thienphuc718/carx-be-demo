import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { ProductCategorySelectedModel } from './ProductCategorySelected';
import { ProductModel } from './Products';
import { ServiceCategoryRelationModel } from './ServiceCategoryRelations';
import { ServiceModel } from './Services';

@Table({
  modelName: 'service_categories',
})
export class ServiceCategoryModel extends Model<ServiceCategoryModel> {
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
    allowNull: true,
  })
  slug: string;

  @Column({
    type: DataType.STRING,    
  })
  image: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  show_on_homepage: boolean;

  @Column({
    type: DataType.INTEGER,
    unique: true
  })
  order: number;

  @Column({
    type: DataType.STRING,    
  })
  mobile_screen: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasMany(() => ServiceCategoryRelationModel)
  categories: ServiceCategoryRelationModel[];

  @BelongsToMany(() => ServiceModel, () => ServiceCategoryRelationModel)
  category_relations: ServiceCategoryRelationModel[];

  @HasMany(() => ProductCategorySelectedModel)
  product_categories: ProductCategorySelectedModel[];

  @BelongsToMany(() => ProductModel, () => ProductCategorySelectedModel)
  product_category_relations: ProductCategorySelectedModel[];

  transformToResponse() {
    const { categories, product_categories, ...serviceCategoryData } = JSON.parse(JSON.stringify(this));
    const serviceList = [];
    if (categories && categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        serviceList.push(categories[i]);
      }
    }

    let productCategoryList = []
    if (product_categories && product_categories.length > 0) {
      for (let i = 0; i < product_categories.length; i++) {
        productCategoryList.push(product_categories[i]);
      }
    }
    return {
      ...serviceCategoryData,
      total_service: serviceList.length,
      total_product: productCategoryList.length
    }
  }
}

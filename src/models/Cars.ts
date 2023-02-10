import {
  BelongsTo,
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
  PrimaryKey
} from 'sequelize-typescript';
import { CustomerModel } from './Customers';

@Table({
  modelName: 'cars',
})
export class CarModel extends Model<CarModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
  })
  customer_id: string;

  @Column({
    type: DataType.STRING,
  })
  brand: string;

  @Column({
    type: DataType.STRING,
  })
  model_name: string;

  @Column({
    type: DataType.STRING,
  })
  model_year: string;

  @Column({
    type: DataType.STRING,
  })
  car_no: string;

  @Column({
    type: DataType.STRING,
  })
  color: string;

  @Column({
    type: DataType.STRING,
  })
  tire_no: string;

  @Column({
    type: DataType.STRING,
  })
  vin_no: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  transformToResponse() {
    try {
      const carData = JSON.parse(JSON.stringify(this));
      const { is_deleted, ...car } = carData
      return car;
    } catch (error) {
      throw error;
    }
  }
}

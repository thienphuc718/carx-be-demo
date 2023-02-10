import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ProductModel } from './Products';
import { InsuranceProductCapacityUnitEnum } from '../modules/products/enum/InsuranceProductEnum';
import {IsNumber, IsOptional} from "class-validator";

@Table({
  modelName: 'insurance_products',
})
export class InsuranceProductModel extends Model<InsuranceProductModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.STRING,
  })
  usage_reason: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  usage_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  car_type_code: string;

  @Column({
    type: DataType.STRING,
  })
  car_type: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  max_insurance_time: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'YEAR',
  })
  insurance_time_unit: string;

  @Column({
    type: DataType.DOUBLE,
  })
  required_non_tax_price: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 10,
  })
  tax_percentage: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  required_taxed_price: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_business: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_voluntary: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_combo: boolean;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  voluntary_price: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  voluntary_amount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  voluntary_seats: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 30_000_000,
  })
  insurance_amount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacity: number;

  @Column({
    type: DataType.ENUM('SEATS', 'TONS', 'LESS_THAN_50_CC', 'MORE_THAN_50_CC', 'MINI_VAN'),
    defaultValue: InsuranceProductCapacityUnitEnum.SEATS,
  })
  capacity_unit: InsuranceProductCapacityUnitEnum;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  combo_price: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

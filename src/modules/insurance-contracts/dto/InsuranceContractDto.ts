import {
  IsDate,
  IsEmail,
  IsEnum, IsInt,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
} from 'class-validator';
import { InsuranceInfoCertificateTypeEnum } from '../../orders/enum/OrderEnum';
import {Type} from "class-transformer";

export class InsuranceContractEntityDto {
  @IsNotEmpty()
  @IsString()
  car_type_code: string;

  @IsNotEmpty()
  @IsString()
  usage_code: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsInt()
  capacity: number;

  @IsNotEmpty()
  @IsNumber()
  insurance_amount: number;

  @IsOptional()
  @IsNumber()
  voluntary_insurance_amount?: number;

  @IsNotEmpty()
  @IsUUID(4)
  order_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  product_id: string;

  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @IsOptional()
  customer_phone_number?: string;

  @IsNotEmpty()
  @IsEmail()
  customer_email: string;

  @IsNotEmpty()
  @IsEnum(InsuranceInfoCertificateTypeEnum)
  customer_certificate_type: InsuranceInfoCertificateTypeEnum;

  @IsNotEmpty()
  customer_certificate_number: string;

  @IsNotEmpty()
  @Length(17, 17)
  frame_no: string;

  @IsNotEmpty()
  // @Length(15, 15)
  engine_no: string;

  @IsNotEmpty()
  contract_no: string;

  @IsOptional()
  voluntary_contract_no?: string;

  @IsNotEmpty()
  carx_contract_number: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  send_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end_date: Date;
}

export class CreateInsuranceContractDto extends InsuranceContractEntityDto {}
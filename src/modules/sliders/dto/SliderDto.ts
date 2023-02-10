import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class SliderEntityDto {
  @IsOptional()
  @IsString()
  image?: string;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_hidden?: boolean;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}

export class FilterSliderDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    title: 'Limit',
    format: 'int32',
    default: 15,
  })
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page?: number;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_hidden?: boolean;
}

export class CreateSliderPayloadDto extends OmitType(SliderEntityDto, [
  'created_at',
  'updated_at',
  'is_deleted',
  'is_hidden',
] as const) {
  @IsNotEmpty()
  @IsString()
  image: string
}

export class UpdateSliderPayloadDto extends OmitType(SliderEntityDto, [
  'created_at',
  'updated_at',
  'is_deleted',  
] as const) {}

export class UpdateSliderOrderPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  // @Max(15)
  // @Min(1)
  new_order: number;
}
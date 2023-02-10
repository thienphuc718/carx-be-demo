import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class FilterPromotionApplyDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  limit: number;

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
  page: number;
}

export class CreatePromotionApplyDto {
  @IsNotEmpty()
  object_name: string;

  @IsNotEmpty()
  @IsNumber()
  object_id: number;

  @IsNotEmpty()
  @IsUUID(4)
  promotion_id: string;
}

export class UpdatePromotionApplyDto {
  @IsOptional()
  object_name?: string;

  @IsOptional()
  @IsNumber()
  object_id?: number;

  @IsOptional()
  @IsUUID(4)
  promotion_id?: string;
}

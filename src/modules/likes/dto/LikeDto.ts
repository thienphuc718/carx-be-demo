import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class LikeEntityDto {
  @IsUUID(4)
  user_id: string;

  @IsUUID(4)
  post_id: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_deleted?: boolean;
}

export class FilterLikeDto {
  @Type(() => Number)
  @IsNumber()
  @Max(200)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 200,
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
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  page: number;

  @IsOptional()
  @IsUUID(4)
  user_id?: string;

  @IsOptional()
  @IsUUID(4)
  post_id?: string;
}

export class CreateLikeDto extends LikeEntityDto {}

export class UpdateLikeDto {

  @IsNotEmpty()
  @IsUUID(4)
  user_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  post_id: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_deleted?: boolean;
}

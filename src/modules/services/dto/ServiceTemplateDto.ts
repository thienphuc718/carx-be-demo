import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetListServiceTemplateDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    title: 'Limit',
    format: 'int32',
  })
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    title: 'Page',
    format: 'int32',
  })
  page: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  keyword: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  category_id: string;
}

import { IsArray, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateProductBrandDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  image: string;
}

export class UpdateProductBrandDto extends PartialType(CreateProductBrandDto) {}

export class DeleteProductBrandDto {
  @IsArray()
  delete_ids: string[];
}

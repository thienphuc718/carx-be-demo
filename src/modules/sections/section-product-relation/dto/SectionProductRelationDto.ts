import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SectionProductRelationEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  section_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  product_id: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateSectionProductRelationPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  new_order: number;
}

export class CreateSectionProductRelationPayloadDto extends OmitType(
  SectionProductRelationEntityDto,
  ['order'] as const,
) {}

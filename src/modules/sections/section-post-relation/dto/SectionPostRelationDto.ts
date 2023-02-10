import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SectionPostRelationEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  section_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  post_id: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateSectionPostRelationPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  new_order: number;
}

export class CreateSectionPostRelationPayloadDto extends OmitType(SectionPostRelationEntityDto, ['order'] as const) {}
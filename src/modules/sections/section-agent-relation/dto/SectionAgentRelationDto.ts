import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SectionAgentEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  section_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateSectionAgentRelationPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  new_order: number;
}

export class CreateSectionAgentRelationPayloadDto extends OmitType(SectionAgentEntityDto, ['order'] as const) {}
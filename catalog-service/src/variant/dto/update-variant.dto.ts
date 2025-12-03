import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantDto } from './create-variant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateVariantDto extends PartialType(CreateVariantDto) {}

export class ReduceStockDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @Min(1)
  quantity: number;
}

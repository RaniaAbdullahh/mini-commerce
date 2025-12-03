import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'M', required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ example: 'Black', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 25.99, required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  price: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: 'TSHIRT-BLK-M', required: false })
  @IsOptional()
  @IsString()
  sku?: string;
}

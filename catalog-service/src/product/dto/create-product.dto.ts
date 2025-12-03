import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'T-Shirt',
    description: 'Name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A comfortable cotton t-shirt',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  //   @IsOptional()
  //   @IsUrl()
  //   imageUrl?: string;
}

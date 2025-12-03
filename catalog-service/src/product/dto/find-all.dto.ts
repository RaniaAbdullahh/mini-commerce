import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllProducts {
  @ApiProperty({
    required: false,
    description: 'search for a product by name or desc',
    type: String,
    example: 'T-shirt',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page_size?: number;
}

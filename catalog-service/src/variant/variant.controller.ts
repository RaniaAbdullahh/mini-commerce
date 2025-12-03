import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ReduceStockDto, UpdateVariantDto } from './dto/update-variant.dto';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Variants')
@Controller('')
export class VariantController {
  constructor(private readonly service: VariantService) {}

  //public endpoints

  @ApiOperation({ summary: 'Get all variants for a product' })
  @ApiResponse({
    status: 200,
    description: 'List of variants returned successfully.',
  })
  @Get('product/:id/variants')
  getVariants(@Param('id') productId: string) {
    return this.service.getVariantsByProduct(productId);
  }

  @ApiOperation({ summary: 'Get single variant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Variant details returned successfully.',
  })
  @Get('variant/:id')
  getVariant(@Param('id') id: string) {
    return this.service.getVariantById(id);
  }

  // admin endpoints
  @ApiOperation({ summary: 'Create a new variant for a product (Admin)' })
  @ApiResponse({ status: 201, description: 'Variant created successfully.' })
  @Post('admin/products/:id/variants')
  @UsePipes(new ValidationPipe({ transform: true }))
  createVariant(@Param('id') productId: string, @Body() dto: CreateVariantDto) {
    return this.service.create(productId, dto);
  }

  @ApiOperation({ summary: 'Update a variant (Admin)' })
  @ApiResponse({ status: 200, description: 'Variant updated successfully.' })
  @Patch('admin/variants/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateVariant(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a variant (Admin)' })
  @ApiResponse({ status: 200, description: 'Variant deleted successfully.' })
  @Delete('admin/variants/:id')
  removeVariant(@Param('id') id: string) {
    return this.service.remove(id);
  }

  //internal endpoint
  @ApiOperation({ summary: 'Reduce stock of a variant (Admin)' })
  @ApiResponse({ status: 200, description: 'Stock reduced successfully.' })
  @Patch('variants/:id/reduce-stock')
  reduceStock(@Param('id') id: string, @Body() dto: ReduceStockDto) {
    return this.service.reduceStock(id, dto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindAllProducts } from './dto/find-all.dto';
import { TotalCountInterceptor } from 'src/utils/interceptors/total-count.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller()
export class ProductController {
  constructor(
    private readonly service: ProductService,
    private readonly prismaService: PrismaService,
  ) {}

  // public endpoints
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiResponse({ status: 200, description: 'List of products returned.' })
  @UseInterceptors(TotalCountInterceptor)
  @Get('products')
  findAll(@Query() query: FindAllProducts) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product returned successfully.' })
  @Get('products/:id')
  get(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  // admin endpoints
  @ApiOperation({ summary: 'Create a new product (Admin)' })
  @Post('admin/products')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.prismaService.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        return this.service.create(dto, prisma);
      },
    );
  }

  @ApiOperation({ summary: 'Update product (Admin)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @Patch('admin/product/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.prismaService.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        return this.service.update(id, dto, prisma);
      },
    );
  }

  @ApiOperation({ summary: 'Delete product (Admin)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @Delete('admin/product/:id')
  async remove(@Param('id') id: string) {
    return this.prismaService.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        return this.service.remove(id, prisma);
      },
    );
  }
}

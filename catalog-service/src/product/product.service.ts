import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FindAllProducts } from './dto/find-all.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/utils/responses/api-response';
import { Product } from './entities/product.entity';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateProductDto,
    prisma: Prisma.TransactionClient,
  ): Promise<ApiResponse<Product>> {
    const product = await prisma.product.create({ data });
    return {
      status: HttpStatus.CREATED,
      message: 'product successfully created',
      data: plainToInstance(Product, product),
    };
  }

  async findAll({
    page = 1,
    page_size = 10,
    search,
  }: FindAllProducts): Promise<ApiResponse<Product[]>> {
    const skip = (page - 1) * page_size;
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: page_size,
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    });
    const totalCount = await this.prisma.product.count({ where });

    return {
      status: HttpStatus.OK,
      message: 'products successfully retrived',
      data: plainToInstance(Product, products),
      totalCount,
    };
  }

  async getOne(id: string): Promise<
    ApiResponse<{
      product: Product;
      availableSizes: string[];
      availableColors: string[];
    }>
  > {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    // aggregate available sizes & colors for convenience
    const sizes = Array.from(
      new Set(product.variants.map((v) => v.size).filter(Boolean)),
    );
    const colors = Array.from(
      new Set(product.variants.map((v) => v.color).filter(Boolean)),
    );
    return {
      status: HttpStatus.OK,
      message: 'product successfully retrived',
      data: {
        product: plainToInstance(Product, product),
        availableSizes: sizes,
        availableColors: colors,
      },
    };
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    prisma: Prisma.TransactionClient,
  ): Promise<ApiResponse<Product>> {
    await this.findProduct(id);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { ...dto },
    });

    return {
      status: HttpStatus.OK,
      message: 'product successfully updated',
      data: updatedProduct,
    };
  }
  // hard deletion
  async remove(
    id: string,
    prisma: Prisma.TransactionClient,
  ): Promise<ApiResponse<boolean>> {
    await this.findProduct(id);
    // delete all it's variants
    await prisma.variant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({
      where: { id },
    });
    return {
      status: HttpStatus.OK,
      message: 'product successfully deleted',
      data: true,
    };
  }
  //helper
  async findProduct(id: string) {
    const existProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existProduct) throw new NotFoundException('Product not found');
  }
}

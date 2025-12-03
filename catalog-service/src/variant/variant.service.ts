import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ReduceStockDto, UpdateVariantDto } from './dto/update-variant.dto';
import { ApiResponse } from 'src/utils/responses/api-response';
import { Variant } from './entities/variant.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VariantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    productId: string,
    dto: CreateVariantDto,
  ): Promise<ApiResponse<Variant>> {
    const variant = await this.prisma.variant.create({
      data: { ...dto, productId },
    });
    return {
      status: HttpStatus.CREATED,
      message: 'variant successfully created',
      data: plainToInstance(Variant, variant),
    };
  }

  async getVariantsByProduct(
    productId: string,
  ): Promise<ApiResponse<Variant[]>> {
    const variants = await this.prisma.variant.findMany({
      where: { productId },
    });
    return {
      status: HttpStatus.OK,
      message: 'variants successfully retrived',
      data: plainToInstance(Variant, variants),
    };
  }

  async getVariantById(id: string): Promise<ApiResponse<Variant>> {
    await this.findVariant(id);
    const variant = await this.prisma.variant.findUnique({ where: { id } });

    return {
      status: HttpStatus.OK,
      message: 'variant successfully retrived',
      data: plainToInstance(Variant, variant),
    };
  }

  async update(
    id: string,
    dto: UpdateVariantDto,
  ): Promise<ApiResponse<Variant>> {
    await this.findVariant(id);
    const updatedVariant = this.prisma.variant.update({
      where: { id },
      data: dto,
    });
    return {
      status: HttpStatus.OK,
      message: 'product successfully updated',
      data: plainToInstance(Variant, updatedVariant),
    };
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    await this.findVariant(id);
    await this.prisma.variant.delete({ where: { id } });
    return {
      status: HttpStatus.OK,
      message: 'variant successfully deleted',
      data: true,
    };
  }

  async reduceStock(
    variantId: string,
    dto: ReduceStockDto,
  ): Promise<ApiResponse<Variant>> {
    await this.findVariant(variantId);
    const variant = await this.prisma.variant.findUnique({
      where: { id: variantId },
    });
    if (variant.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock');
    }
    const updated = await this.prisma.variant.update({
      where: { id: variantId },
      data: {
        stock: { decrement: dto.quantity },
      },
    });

    return {
      status: HttpStatus.OK,
      message: 'Stock successfully reduced',
      data: plainToInstance(Variant, updated),
    };
  }

  //helper
  async findVariant(id: string) {
    const existVariant = await this.prisma.variant.findUnique({
      where: { id },
    });
    if (!existVariant) throw new NotFoundException('Variant not found');
  }
}

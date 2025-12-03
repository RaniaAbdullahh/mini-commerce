import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VariantController],
  providers: [VariantService, PrismaService],
})
export class VariantModule {}

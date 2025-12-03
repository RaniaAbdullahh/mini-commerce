import { Variant } from '../../variant/entities/variant.entity';
export class Product {
  id: string;
  name: string;
  description?: string;

  createdAt: Date;
  updatedAt: Date;
  variants?: Variant[];

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}

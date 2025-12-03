export class Variant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  price: number;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Variant>) {
    Object.assign(this, partial);
  }
}

export type CartItem = {
  variant_id: string;
  product_id?: string;
  name?: string;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

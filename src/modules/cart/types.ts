export interface AddToCartBody {
  product_uuid: string;
  quantity: number;
  price: number;
}
export interface UpdateCartBody {
  product_uuid: string;
  quantity: number;
  price: number;
}

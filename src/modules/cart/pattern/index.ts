export const CART_PRODUCT_MS_PATTERN: any = {
  TCP: {
    fetchAllCartProduct: {
      role: 'fetchAllCartProduct',
      cmd: 'fetch-all-cart-product',
    },
    AddProductToCart: {
      role: 'AddProductToCart',
      cmd: 'add-product-to-cart',
    },
    RemoveProductFromCart: {
      role: 'RemoveProductFromCart',
      cmd: 'remove-product-from-cart',
    },
    UpdateCart: {
      role: 'UpdateCart',
      cmd: 'update-cart',
    },
  },
  KAFKA: {
    fetchAllCartProduct: 'fetchAllCartProduct',
    AddProductToCart: 'AddProductToCart',
    RemoveProductFromCart: 'RemoveProductFromCart',
    UpdateCart: 'UpdateCart',
  },
  REDIS: [],
  RABBITMQ: [],
};

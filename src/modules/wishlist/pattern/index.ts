export const WISHLIST_PRODUCT_MS_PATTERN: any = {
  TCP: {
    fetchAllWishlistProduct: {
      role: 'fetchAllWishlistProduct',
      cmd: 'fetch-all-wishlist-product',
    },
    AddProductToWishList: {
      role: 'AddProductToWishList',
      cmd: 'add-product-to-wishlist',
    },
    RemoveProductFromWishList: {
      role: 'RemoveProductFromWishList',
      cmd: 'remove-product-from-wishlist',
    },
  },
  KAFKA: {
    fetchAllWishlistProduct: 'fetchAllWishlistProduct',
    AddProductToWishList: 'AddProductToWishList',
    RemoveProductFromWishList: 'RemoveProductFromWishList',
  },
  REDIS: [],
  RABBITMQ: [],
};

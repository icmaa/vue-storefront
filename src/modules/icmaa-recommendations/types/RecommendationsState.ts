import Product from '@vue-storefront/core/modules/catalog/types/Product'

export interface Recommendations {
  eventType: string,
  servingConfigs: string,
  productId: string,
  products: Product[]
}

export default interface RecommendationsState {
  list: Recommendations[]
}

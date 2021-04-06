import Product from 'core/modules/catalog/types/Product'
import OrgWishlistState from '@vue-storefront/core/modules/wishlist/types/WishlistState'

export default interface WishlistState extends OrgWishlistState {
  products: Product[]
}

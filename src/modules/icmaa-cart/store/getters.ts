import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '../types/CartState'
import AppliedCoupon from '@vue-storefront/core/modules/cart/types/AppliedCoupon'
import { calcItemsHmac } from '@vue-storefront/core/helpers'

const getters: GetterTree<CartState, RootState> = {
  /**
   * We are now adding the cart-id-hash to the items, this way we don't need the server-cart-token anymore.
   * The server-cart-token won't work as unique cart-hash anymore because it changes on each `cart/pull`.
   */
  getCurrentCartHash: state => calcItemsHmac(state.cartItems, ''),
  getCoupon: ({ platformTotals }): AppliedCoupon | false => {
    if (!platformTotals) {
      return false
    }

    if (platformTotals.hasOwnProperty('coupon_code') && platformTotals.coupon_code !== null) {
      return { code: platformTotals.coupon_code, discount: platformTotals.discount_amount }
    }

    const giftcert = platformTotals.total_segments.find(s => s.code === 'ugiftcert')
    if (giftcert) {
      return { code: giftcert.giftcert_code, discount: giftcert.base_balances * -1 }
    }
  },
  getFreeCartItems: (state): string[] => state.freeCartItems
}

export default getters

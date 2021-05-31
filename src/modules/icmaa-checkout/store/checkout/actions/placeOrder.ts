import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CheckoutState, RootState> = {
  async collectOrderData ({ getters }) {
    // const order: any = {
    //   user_id: this.$store.state.user.current ? this.$store.state.user.current.id.toString() : '',
    //   cart_id: this.$store.state.cart.cartServerToken ? this.$store.state.cart.cartServerToken.toString() : '',
    //   products: this.$store.state.cart.cartItems,
    //   addressInformation: {
    //     billingAddress: {
    //       region: this.payment.state,
    //       region_id: this.payment.region_id ? this.payment.region_id : 0,
    //       country_id: this.payment.country,
    //       street: [this.payment.streetAddress, this.payment.apartmentNumber],
    //       company: this.payment.company,
    //       telephone: this.payment.phoneNumber,
    //       postcode: this.payment.zipCode,
    //       city: this.payment.city,
    //       firstname: this.payment.firstname,
    //       lastname: this.payment.lastname,
    //       email: this.personalDetails.email,
    //       region_code: this.payment.region_code ? this.payment.region_code : '',
    //       vat_id: this.payment.taxId
    //     },
    //     shipping_method_code: this.shippingMethod.method_code ? this.shippingMethod.method_code : this.shipping.shippingMethod,
    //     shipping_carrier_code: this.shippingMethod.carrier_code ? this.shippingMethod.carrier_code : this.shipping.shippingCarrier,
    //     payment_method_code: this.getPaymentMethod(),
    //     payment_method_additional: this.payment.paymentMethodAdditional,
    //     shippingExtraFields: this.shipping.extraFields
    //   }
    // }
    // if (!this.isVirtualCart) {
    //   order.addressInformation.shippingAddress = {
    //     region: this.shipping.state,
    //     region_id: this.shipping.region_id ? this.shipping.region_id : 0,
    //     country_id: this.shipping.country,
    //     street: [this.shipping.streetAddress, this.shipping.apartmentNumber],
    //     company: '',
    //     telephone: this.shipping.phoneNumber,
    //     postcode: this.shipping.zipCode,
    //     city: this.shipping.city,
    //     firstname: this.shipping.firstname,
    //     lastname: this.shipping.lastname,
    //     email: this.personalDetails.email,
    //     region_code: this.shipping.region_code ? this.shipping.region_code : ''
    //   }
    // }

    return {}
  },
  async placeOrder ({ dispatch }) {
    try {
      const order = await dispatch('collectOrderData')
      const result = await dispatch('order/placeOrder', order, { root: true })
      if (!result.resultCode || result.resultCode === 200) {
        await dispatch('updateOrderTimestamp')

        await dispatch('cart/clear', { sync: false }, { root: true })
        await dispatch('dropPassword')
      }
    } catch (e) {
      Logger.error(e, 'checkout')()
    }
  }
}

export default actions

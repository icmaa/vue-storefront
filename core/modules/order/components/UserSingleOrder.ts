import { mapGetters } from 'vuex';

/**
 * Component responsible for displaying single user order. Requires User module.
 */
export const UserSingleOrder = {
  name: 'UserSingleOrder',
  computed: {
    ...mapGetters({
      ordersHistory: 'user/getOrdersHistory'
    }),
    order () {
      return this.ordersHistory.find(order =>
        parseInt(order.entity_id) === parseInt(this.$route.params.orderId)
      )
    },
    paymentMethod () {
      return this.order && this.order.payment.additional_information[0]
    },
    billingAddress () {
      return this.order && this.order.billing_address
    },
    shippingAddress () {
      return this.order && this.order.extension_attributes.shipping_assignments[0].shipping.address
    },
    singleOrderItems () {
      if (!this.order) return []

      return this.order.items.filter((item) => {
        return !item.parent_item_id
      })
    }
  }
}

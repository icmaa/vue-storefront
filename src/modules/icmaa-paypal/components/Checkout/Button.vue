<template>
  <div
    id="paypal-button-container"
    class="t-flex"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import { round } from 'icmaa-config/helpers/price'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'PayPalButton',
  props: {
    color: {
      type: String,
      default: 'gold',
      validator: (v) => ['gold', 'blue', 'silver', 'white', 'black'].includes(v)
    }
  },
  data () {
    return {
      shippingMethodsLoaded: false
    }
  },
  computed: {
    ...mapGetters({
      currency: 'icmaaPayPal/getCurrency',
      locale: 'icmaaPayPal/getLocale',
      brandName: 'icmaaPayPal/getBrandName',
      softDescriptor: 'icmaaPayPal/getSoftDescriptor',
      referenceId: 'icmaaPayPal/getReferenceId',
      cartItems: 'cart/getCartItems',
      totals: 'cart/getTotals'
    }),
    grandTotal () {
      const shipping = this.totals.find(t => t.code === 'shipping')?.value_incl_tax || 0
      return this.totals.find(t => t.code === 'grand_total')?.value - shipping || 0
    },
    isTicket () {
      return this.cartItems.some(i => i.department === 4)
    }
  },
  mounted () {
    this.renderButton()
  },
  methods: {
    renderButton () {
      window.paypal
        .Buttons({
          style: {
            shape: 'rect',
            color: this.color,
            layout: 'horizontal',
            label: 'checkout',
            tagline: false
          },
          onClick: this.onClick,
          createOrder: this.createOrder,
          onShippingChange: this.onShippingChange,
          onApprove: this.onApprove,
          onError: this.onError
        })
        .render('#paypal-button-container')
    },
    onClick (data, actions) {
      if (this.isTicket) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: this.$t(
            'We are sorry, it\'s not possible to buy tickets using PayPal. Please use another payment-method.'
          ),
          action1: { label: this.$t('OK') },
          action2: {
            label: this.$t('Go to checkout'),
            action: this.goToCheckout
          },
          timeToLive: 8000
        })

        return actions.reject()
      } else {
        return actions.resolve()
      }
    },
    createOrder (data, actions) {
      return actions.order.create({
        application_context: {
          brand_name: this.brandName,
          locale: this.locale,
          shipping_preference: 'GET_FROM_FILE'
        },
        purchase_units: [
          {
            amount: {
              currency_code: this.currency,
              value: round(this.grandTotal)
            },
            soft_descriptor: this.softDescriptor,
            invoice_id: this.referenceId
          }
        ]
      })
    },
    async onShippingChange (data, actions) {
      const patchActions = []
      const { shipping_address } = data

      let {
        city,
        postal_code: postcode,
        country_code: country_id,
        state: region_id
      } = shipping_address

      if (['Empty', ''].includes(region_id)) {
        region_id = null
      }

      const address = {
        city,
        postcode,
        country_id,
        region_id
      }

      const methodCode = data?.selected_shipping_option?.id
      let shippingMethods = await this.$store.dispatch('icmaaPayPal/getShipping', { address, methodCode })
      if (shippingMethods?.error) {
        throw Error(shippingMethods?.error)
      }

      shippingMethods = shippingMethods.map(method => ({
        id: method.code,
        label: `${method.method_title} - ${method.method_description}`,
        selected: data?.selected_shipping_option && data?.selected_shipping_option.id === method.code,
        amount: {
          value: round(method.price),
          currency_code: this.currency
        }
      }))

      const addMethods = this.shippingMethodsLoaded === false || !data?.selected_shipping_option

      if (
        (!data?.selected_shipping_option && shippingMethods.length > 0) ||
        (data?.selected_shipping_option && shippingMethods.length > 0 &&
          !shippingMethods.some(o => o.selected === true))
      ) {
        data.selected_shipping_option = shippingMethods[0]
        data.selected_shipping_option.selected = true
      } else if (shippingMethods.length > 0) {
        data.selected_shipping_option = shippingMethods.find(m => m.selected === true)
      }

      if (data?.selected_shipping_option) {
        const shippingAmount = parseFloat(data.selected_shipping_option.amount.value)
        const totalInclShipping = this.grandTotal + shippingAmount

        patchActions.push({
          op: 'replace',
          path: "/purchase_units/@reference_id=='default'/amount",
          value: {
            currency_code: this.currency,
            value: round(totalInclShipping),
            breakdown: {
              item_total: {
                currency_code: this.currency,
                value: round(this.grandTotal)
              },
              shipping: {
                currency_code: this.currency,
                value: round(shippingAmount)
              }
            }
          }
        })
      }

      patchActions.push({
        op: addMethods ? 'add' : 'replace',
        path: "/purchase_units/@reference_id=='default'/shipping/options",
        value: shippingMethods
      })

      return actions.order
        .patch(patchActions)
        .then(() => {
          this.shippingMethodsLoaded = true
        })
    },
    async onApprove (data, actions) {
      if (!this.shippingMethodsLoaded) {
        return
      }

      const { orderID: orderId, payerID: payerId } = data
      const result = await this.$store.dispatch('icmaaPayPal/approve', { orderId, payerId })
      if (result?.error) {
        throw Error(result?.error)
      }

      await actions.order.patch([
        {
          op: 'replace',
          path: "/purchase_units/@reference_id=='default'/invoice_id",
          value: `${result.incrementId}`
        }
      ])

      return actions.order
        .capture()
        .then(this.afterCapture)
    },
    async afterCapture (resp) {
      if (resp.status !== 'COMPLETED') {
        throw Error('Capture wasn\'t complete')
      }

      const { payer, purchase_units } = resp
      const { email_address: email } = payer
      const { shipping } = purchase_units[0]
      const { name } = shipping

      const nameAsArray = name.full_name.split(' ')
      const firstname = nameAsArray.shift()
      const lastname = nameAsArray.join(' ')

      const {
        address_line_1: street1,
        address_line_2: street2,
        admin_area_1: state,
        admin_area_2: city,
        postal_code: postcode,
        country_code: country_id
      } = shipping.address

      let street = street1
      if (street2) {
        street += ', ' + street2
      }

      const address = { firstname, lastname, street, city, postcode, state, country_id }

      const response = await this.$store.dispatch(
        'icmaaPayPal/capture',
        { email, address, captureResponse: resp }
      )

      if (response?.error) {
        throw Error(response?.error)
      }

      this.$store.dispatch('ui/closeAll')

      this.$store.dispatch('checkout/setGatewayOrder', { order: null, response })
      this.$router.push('checkout-gateway-success')
    },
    async onError (error) {
      Logger.error('An error appeared during checkout:', 'icmaa-paypal', error)()

      let { message } = error
      await this.$store.dispatch('icmaaPayPal/fail', { error: message })

      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(
          'There was an error during your payment. Please try again, or contact our support.'
        ),
        action1: { label: this.$t('OK') }
      })
    },
    goToCheckout () {
      this.$store.dispatch('ui/closeAll')
      this.$router.push(this.localizedRoute({ name: 'checkout' }))
    }
  }
}
</script>

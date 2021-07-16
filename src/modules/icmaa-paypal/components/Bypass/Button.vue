<template>
  <div id="paypal-button-container" class="t-flex" />
</template>

<script>
import { mapGetters } from 'vuex'
import { round } from 'icmaa-config/helpers/price'

export default {
  name: 'PayPalButton',
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
      totals: 'cart/getTotals'
    }),
    grandTotal () {
      return this.totals.find(t => t.code === 'grand_total')?.value || 0
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
            color: 'gold',
            layout: 'horizontal',
            label: 'checkout',
            tagline: false
          },
          createOrder: this.createOrder,
          onShippingChange: this.onShippingChange,
          onApprove: this.onApprove,
          onError: this.onError
        })
        .render('#paypal-button-container')
    },
    createOrder (data, actions) {
      // ...

      console.error('PayPal', 'createOrder', arguments)

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
      // ...

      console.error('PayPal', 'onShippingChange', arguments)

      const { shipping_address } = data
      const {
        city,
        post_code: postcode,
        country_code: country_id
      } = shipping_address

      const address = {
        city,
        street: [
          'adsasd'
        ],
        postcode,
        country_id,
        useForBilling: true
      }
      // this.$store.dispatch('checkout/saveShippingDetails', address)
      // this.$store.dispatch('checkout/savePaymentDetails', address)
      // await this.$store.dispatch('cart/syncShippingMethods', { forceServerSync: true })

      const patchActions = []

      const addMethods = this.shippingMethodsLoaded === false || !data?.selected_shipping_option

      if (!data.selected_shipping_option) {
        data.selected_shipping_option = {
          id: 'UPS10',
          label: 'UPS Label 100',
          selected: true,
          amount: {
            value: '10.00',
            currency_code: this.currency
          }
        }
      }

      if (data.selected_shipping_option) {
        data.amount.value = this.grandTotal + parseFloat(data.selected_shipping_option.amount.value)

        patchActions.push({
          op: 'replace',
          path: "/purchase_units/@reference_id=='default'/amount",
          value: {
            currency_code: this.currency,
            value: round(data.amount.value),
            breakdown: {
              item_total: {
                currency_code: this.currency,
                value: round(this.grandTotal)
              },
              shipping: {
                currency_code: this.currency,
                value: round(parseFloat(data.selected_shipping_option.amount.value))
              }
            }
          }
        })
      }

      patchActions.push({
        op: addMethods ? 'add' : 'replace',
        path: "/purchase_units/@reference_id=='default'/shipping/options",
        value: [{
          id: 'UPS10',
          label: 'UPS Label 100',
          selected: addMethods || data.selected_shipping_option.id === 'UPS10',
          amount: {
            value: '10.00',
            currency_code: this.currency
          }
        },
        {
          id: 'UPS20',
          label: 'UPS Label 200',
          selected: !addMethods && data.selected_shipping_option.id === 'UPS20',
          amount: {
            value: '20.00',
            currency_code: this.currency
          }
        }]
      })

      return actions.order
        .patch(patchActions)
        .then(() => {
          this.shippingMethodsLoaded = true
        })
    },
    onApprove (data, actions) {
      // ...

      console.error('PayPal', 'onApprove', arguments)

      return actions.order.capture().then(details => {
        console.error('PayPal', 'capured', details)
        alert('Transaction completed by ' + details.payer.name.given_name);
      });
    },
    onError () {
      // ...

      console.error('PayPal', 'onError', arguments)
    }
  }
}
</script>

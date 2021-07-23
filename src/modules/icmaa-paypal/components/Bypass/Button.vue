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
          onChancel: this.onChancel,
          onError: this.onError
        })
        .render('#paypal-button-container')
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
      let shippingMethods = await this.$store.dispatch('icmaaPayPal/getBypassShipping', { address, methodCode })
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

      if (!data?.selected_shipping_option && shippingMethods.length > 0) {
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
      const { orderID: orderId, payerID: payerId } = data
      const result = await this.$store.dispatch('icmaaPayPal/bypassApprove', { orderId, payerId })

      await actions.order.patch([
        {
          op: 'replace',
          path: "/purchase_units/@reference_id=='default'/invoice_id",
          value: `${result.incrementId}`
        }
      ])

      return actions.order.capture().then(async resp => {
        const { payer, purchase_units } = resp
        const { name, email_address: email } = payer
        const { given_name: firstname, surname: lastname } = name
        const { shipping } = purchase_units[0]
        const {
          address_line_1: street,
          admin_area_1: state,
          admin_area_2: city,
          postal_code: postcode,
          country_code: country_id
        } = shipping.address

        const address = { firstname, lastname, street, city, postcode, state, country_id }

        const result = await this.$store.dispatch(
          'icmaaPayPal/bypassCapture',
          { email, address, captureResponse: resp }
        )

        console.error('PayPal', 'capured', { resp, result })
      });
    },
    onChancel () {
      // ...

      console.error('PayPal', 'onChancel', arguments)
    },
    onError () {
      // ...

      console.error('PayPal', 'onError', arguments)
    }
  }
}
</script>

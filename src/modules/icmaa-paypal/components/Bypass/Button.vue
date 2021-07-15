<template>
  <div id="paypal-button-container" class="t-flex" v-if="sdkLoaded" />
</template>

<script>
export default {
  name: 'PayPalButton',
  data () {
    return {
      sdkLoaded: false,
      shippingMethodsLoaded: false,
      // @todo Put this into config file
      clientId: 'ARrpPCWTSMu9x6I48yQuhPCBvNgugYfe7Twegv1YSmHeqXJ5onmCZ5bK0umPGR4B61hMg5tl8UzyOjQx',
      currency: 'EUR'
    }
  },
  async mounted () {
    await this.loadSdkScript()
    this.renderButton()
  },
  methods: {
    loadSdkScript () {
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.async = true
        script.src = `//www.paypal.com/sdk/js?client-id=${this.clientId}&currency=${this.currency}`
        script.onload = () => {
          this.sdkLoaded = true
          resolve()
        }
        document.body.appendChild(script)
      })
    },
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
          brand_name: 'IC Music and Apparel GmbH',
          locale: 'de-DE',
          shipping_preference: 'GET_FROM_FILE'
        },
        purchase_units: [
          {
            amount: {
              currency_code: this.currency,
              value: '10'
            },
            soft_descriptor: 'soft_descriptor',
            custom_id: '123123123',
            invoice_id: '123123'
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
      this.$store.dispatch('checkout/saveShippingDetails', address)
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
        data.amount.value =
              parseFloat(10) +
              parseFloat(data.selected_shipping_option.amount.value);

        patchActions.push({
          op: 'replace',
          path: "/purchase_units/@reference_id=='default'/amount",
          value: {
            currency_code: this.currency,
            value: data.amount.value,
            breakdown: {
              item_total: {
                currency_code: this.currency,
                value: 10
              },
              shipping: {
                currency_code: this.currency,
                value: parseFloat(data.selected_shipping_option.amount.value)
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

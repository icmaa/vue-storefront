<template>
  <div class="t-text-sm">
    <validation-messages
      class="t-mb-4"
      :validations="[
        {
          condition: error,
          text: error
        },
        {
          condition: ($v.sdkLoaded.$error && !$v.sdkLoaded.notFalse) || ($v.widgetLoaded.$error && !$v.widgetLoaded.notFalse),
          text: $t('Please wait until Klarna is ready.')
        }
      ]"
    />
    <div id="klarna_container" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger'
import { notFalse } from 'icmaa-config/helpers/validators'
import ApmMethod from 'icmaa-checkout-com/mixins/methods/ApmMethod'
import ValidationMessages from 'theme/components/core/blocks/Form/ValidationMessages.vue'

export default {
  name: 'CheckoutComKlarnaInfo',
  mixins: [ ApmMethod ],
  components: {
    ValidationMessages
  },
  data () {
    return {
      sdkLoaded: false,
      widgetLoaded: false,
      error: null
    }
  },
  computed: {
    ...mapGetters({
      personalDetails: 'checkout/getPersonalDetails',
      billingAddress: 'checkout/getPaymentDetails'
    }),
    clientToken () {
      return this.info.clientToken
    },
    paymentMethods () {
      return this.info.paymentMethods
    },
    orderData () {
      const {
        firstname: given_name,
        lastname: family_name,
        street,
        postcode: postal_code,
        city,
        region,
        country_id: country,
        telephone: phone
      } = this.billingAddress

      const billingAddress = {
        given_name,
        family_name,
        email: this.personalDetails.email,
        street_address: street.join(' '),
        street_address2: '',
        postal_code,
        city,
        region,
        phone,
        country
      }

      return {
        billing_address: billingAddress,
        customer: {
          date_of_birth: this.personalDetails.dob || false
        }
      }
    }
  },
  async mounted () {
    window.klarnaAsyncCallback = this.klarnaAsyncCallback
    await this.loadSdkScript()
  },
  methods: {
    loadSdkScript () {
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.async = true
        script.src = '//x.klarnacdn.net/kp/lib/v1/api.js'
        script.onload = () => { resolve() }
        document.body.appendChild(script)
      })
    },
    klarnaAsyncCallback () {
      this.sdkLoaded = true

      try {
        const k = window.Klarna.Payments.init({
          client_token: this.clientToken
        });

        k.load(
          {
            container: '#klarna_container',
            payment_method_categories: this.paymentMethods.map(m => m.identifier),
            instance_id: 'icmaa-klarna-payments-instance'
          },
          this.orderData,
          () => {
            this.widgetLoaded = true
          }
        )
      } catch (e) {
        this.error = e.message
        Logger.error('Couldn\'t init Klarna SDK', 'icmaa-checkout-com', e)()
      }
    }
  },
  validations: {
    sdkLoaded: {
      notFalse
    },
    widgetLoaded: {
      notFalse
    }
  }
}
</script>

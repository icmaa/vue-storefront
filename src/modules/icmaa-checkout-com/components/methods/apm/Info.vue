<template>
  <div class="t-relative">
    <div class="t-pt-4" v-if="methods[apmMethodCode]">
      <component :code="apmMethodCode" :is="methods[apmMethodCode]" />
    </div>
  </div>
</template>

<script>

import { CODE } from 'icmaa-checkout-com/store/methods/apm'
import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'

export default {
  name: 'CheckoutComApmInfo',
  mixins: [ MethodInfoBoxMixin ],
  data () {
    return {
      methods: {
        giropay: () => import(
          /* webpackChunkName: "icmaa-checkout-com-method-apm-giropay" */
          'icmaa-checkout-com/components/methods/apm/Giropay.vue'
        ),
        sepa: () => import(
          /* webpackChunkName: "icmaa-checkout-com-method-apm-sepa" */
          'icmaa-checkout-com/components/methods/apm/Sepa.vue'
        )
      }
    }
  },
  props: {
    code: {
      type: String,
      required: true
    },
    method: {
      type: [Object, Boolean],
      required: true
    }
  },
  computed: {
    apmMethodCode () {
      const regexp = new RegExp(`${CODE}_(.*)`, 'gm')
      return this.code.replace(regexp, '$1')
    }
  }
}
</script>

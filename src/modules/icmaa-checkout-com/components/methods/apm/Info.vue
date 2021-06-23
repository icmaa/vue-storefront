<template>
  <div :class="{ 't-pt-2': !!info.description }">
    <div
      class="t-text-sm"
      v-text="info.description"
      v-if="!!info.description"
    />
    <component
      :code="apmMethodCode"
      :is="methods[apmMethodCode]"
      v-if="hasChildComponent"
      :class="[ !!info.description ? 't-mt-4' : 't-mt-2' ]"
    />
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
        ),
        ideal: () => import(
          /* webpackChunkName: "icmaa-checkout-com-method-apm-ideal" */
          'icmaa-checkout-com/components/methods/apm/Ideal.vue'
        )
      }
    }
  },
  computed: {
    hasChildComponent () {
      return !!this.methods[this.apmMethodCode]
    },
    apmMethodCode () {
      const regexp = new RegExp(`${CODE}_(.*)`, 'gm')
      return this.code.replace(regexp, '$1')
    }
  }
}
</script>

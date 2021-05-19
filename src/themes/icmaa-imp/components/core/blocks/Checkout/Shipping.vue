<template>
  <div class="shipping">
    <div v-if="hasShippingMethod">
      <div
        v-for="method in shippingMethods"
        :key="method.code"
      >
        <base-checkbox
          :name="method.code"
          :id="method.code"
          :value-prop="method.code"
          v-model="selectedMethod"
        >
          <h3>{{ method.title }}</h3>
          <p>{{ method.description }}</p>
          <p>{{ price(method.amount) }}</p>
        </base-checkbox>
      </div>
    </div>
    <div v-else>
      {{ $t('There are currently no shipping options available for your shipping address.') }}
    </div>
  </div>
</template>

<script>
import Shipping from 'icmaa-checkout/components/Shipping'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'

export default {
  components: {
    BaseCheckbox
  },
  mixins: [ Shipping ],
  validations () {

  }
}
</script>

<template>
  <div class="shipping">
    <template v-if="active && !done">
      <div v-if="hasShippingMethod">
        <div
          v-if="$v.selected.$error && (!$v.selected.required || !$v.selected.notFalse)"
          class="t-text-sm t-text-alert t-mb-4"
        >
          {{ $t('Please select a shipping method.') }}
        </div>
        <shipping-method
          v-for="method in shippingMethods"
          :key="method.code"
          :method="method"
          v-model="selected"
          class="t-mb-4"
        />
        <button-component
          class="t-w-full lg:t-w-auto t-mt-8"
          type="primary"
          @click.native.stop="submit"
          v-if="!isLoading"
        >
          {{ $t(('Continue to payment')) }}
        </button-component>
      </div>
      <div v-else>
        {{ $t('There are currently no shipping options available for your shipping address.') }}
      </div>
    </template>
    <template v-else-if="!active && done">
      <shipping-method
        :method="selectedMethod"
        v-model="selected"
        :disabled="true"
      />
    </template>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'

import Shipping from 'icmaa-checkout/components/Shipping'
import ShippingMethod from 'theme/components/core/blocks/Checkout/Shipping/Method'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    ShippingMethod,
    ButtonComponent
  },
  mixins: [ Shipping ],
  validations: {
    selected: {
      required,
      notFalse
    }
  }
}
</script>

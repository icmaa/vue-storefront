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
        <priority-handling
          v-model="priorityHandling"
          class="t-mt-6 t-mb-4"
        />
        <button-component
          class="t-w-full lg:t-w-auto t-mt-8"
          type="primary"
          @click.native.stop="submit"
          v-if="!isLoading"
          data-test-id="NextStepButton"
        >
          {{ $t(('Continue to payment')) }}
        </button-component>
      </div>
      <div v-else class="t-mb-4 t-text-sm">
        {{ $t('There are currently no shipping options available for your shipping address.') }}
      </div>
    </template>
    <template v-else-if="!active && done">
      <shipping-method
        :method="selectedMethod"
        v-model="selected"
        :disabled="true"
      />
      <priority-handling
        v-if="priorityHandling"
        v-model="priorityHandling"
        :disabled="true"
        class="t-mt-6"
      />
    </template>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'

import Shipping from 'icmaa-checkout/components/Shipping'
import ShippingMethod from 'theme/components/core/blocks/Checkout/Shipping/Method'
import PriorityHandling from 'theme/components/core/blocks/Checkout/Shipping/PriorityHandling'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    ShippingMethod,
    PriorityHandling,
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

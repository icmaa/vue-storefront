<template>
  <div class="shipping">
    <template v-if="active && !done">
      <div v-if="hasShippingMethod">
        <div
          v-if="($v.selected.$error && (!$v.selected.required || !$v.selected.notFalse)) || (message && message.length > 0)"
          class="t-text-sm t-text-alert t-mb-4"
        >
          <template v-if="message">
            {{ $t(message) }}
          </template>
          <template v-else>
            {{ $t('Please select a shipping method.') }}
          </template>
        </div>
        <shipping-method
          v-for="method in shippingMethods"
          :key="method.code"
          :method="method"
          v-model="selected"
          class="t-mb-4"
        />
        <div v-if="additionalCharges" class="t-my-4">
          <additional-charges
            v-for="additional in additionalCharges"
            :key="additional.key"
            :charge="additional"
            v-model="selectedAdditionalCharges[additional.key]"
            class="t-mt-2 lg:t-mt-0"
          />
        </div>
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
        <template v-if="message">
          {{ message }}
        </template>
        <template v-else>
          {{ $t('There are currently no shipping options available for your shipping address.') }}
        </template>
      </div>
    </template>
    <template v-else-if="!active && done">
      <shipping-method
        :method="selectedMethod"
        v-model="selected"
        :disabled="true"
      />
      <div v-if="additionalCharges" class="t-mt-4">
        <additional-charges
          v-for="(additional, i) in additionalCharges"
          :key="additional.key"
          :charge="additional"
          v-model="selectedAdditionalCharges[i]"
          :disabled="true"
          class="t-mt-2 lg:t-mt-0"
        />
      </div>
    </template>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'

import Shipping from 'icmaa-checkout/components/Shipping'
import ShippingMethod from 'theme/components/core/blocks/Checkout/Shipping/Method'
import AdditionalCharges from 'theme/components/core/blocks/Checkout/Shipping/AdditionalCharges'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    ShippingMethod,
    AdditionalCharges,
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

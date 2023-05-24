<template>
  <div class="addresses">
    <div
      v-if="error"
      class="t-mb-4 t-text-sm t-text-alert"
      v-text="error"
    />
    <form v-if="active">
      <address-component
        ref="shippingAddress"
        v-model="shippingAddress"
        :enable-poststation="true"
      />
      <base-checkbox
        id="use-for-billing"
        v-model="billingAddressIsSameAsShipping"
        class="t-mb-4 t-w-full"
        name="use-for-billing"
      >
        {{ $t('Use also as billing address') }}
      </base-checkbox>
      <address-component
        v-if="!billingAddressIsSameAsShipping"
        ref="billingAddress"
        v-model="billingAddress"
        type="billing"
        :label="$t('Billing address')"
        class="t-mt-8"
      />
      <button-component
        class="t-mt-4 t-w-full lg:t-w-auto"
        type="primary"
        data-test-id="NextStepButton"
        @click.native.stop="submit"
      >
        {{ $t(('Continue to shipping')) }}
      </button-component>
    </form>
    <div
      v-if="!active && done"
      class="done t-text-sm"
    >
      <div class="shipping-address">
        <h3
          v-if="!billingAddressIsSameAsShipping"
          class="t-text-xs t-font-light t-text-base-light"
          v-text="$t('Shipping address')"
        />
        <address-preview
          v-if="shippingAddressDTO"
          :address="shippingAddressDTO"
        />
        <base-checkbox
          v-if="billingAddressIsSameAsShipping"
          id="use-for-billing-read-only"
          class="t-mt-4 t-w-full"
          name="use-for-billing-read-only"
          :value="true"
          disabled
        >
          {{ $t('Use also as billing address') }}
        </base-checkbox>
      </div>
      <div
        v-if="!billingAddressIsSameAsShipping && billingAddressDTO"
        class="billing-address t-mt-4"
      >
        <h3
          class="t-text-xs t-font-light t-text-base-light"
          v-text="$t('Billing address')"
        />
        <address-preview :address="billingAddressDTO" />
      </div>
    </div>
  </div>
</template>

<script>

import Addresses from 'icmaa-checkout/components/Addresses'
import AddressComponent from 'theme/components/core/blocks/Checkout/Address'
import AddressPreview from 'theme/components/core/blocks/Checkout/Addresses/AddressPreview'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Addresses',
  components: {
    AddressComponent,
    BaseCheckbox,
    ButtonComponent,
    AddressPreview
  },
  mixins: [ Addresses ]
}
</script>

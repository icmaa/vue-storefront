<template>
  <div class="addresses">
    <form v-if="active">
      <address-component
        v-model="shippingAddress"
        ref="shippingAddress"
      />
      <checkbox-component
        class="t-w-full t-mb-4"
        name="use-for-billing"
        id="use-for-billing"
        v-model="billingAddressIsSameAsShipping"
      >
        {{ $t('Use also as billing address') }}
      </checkbox-component>
      <address-component
        type="billing"
        :label="$t('Billing address')"
        v-model="billingAddress"
        ref="billingAddress"
        class="t-mt-8"
        v-if="!billingAddressIsSameAsShipping"
      />
      <button-component
        class="t-w-full lg:t-w-auto t-mt-4"
        type="primary"
        @click.native.stop="submit"
      >
        {{ $t(('Continue to shipping')) }}
      </button-component>
    </form>
    <div v-if="!active && done" class="done t-text-sm">
      <div class="shipping-address">
        <h3
          v-if="!billingAddressIsSameAsShipping"
          v-text="$t('Shipping address')"
          class="t-font-light t-text-xs t-text-base-light"
        />
        <address-preview
          v-if="shippingAddressDTO"
          :address="shippingAddressDTO"
        />
        <checkbox-component
          v-if="billingAddressIsSameAsShipping"
          class="t-w-full t-mt-4"
          name="use-for-billing-read-only"
          id="use-for-billing-read-only"
          :value="true"
          disabled
        >
          {{ $t('Use also as billing address') }}
        </checkbox-component>
      </div>
      <div
        v-if="!billingAddressIsSameAsShipping && billingAddressDTO"
        class="billing-address t-mt-4"
      >
        <h3 v-text="$t('Billing address')" class="t-font-light t-text-xs t-text-base-light" />
        <address-preview :address="billingAddressDTO" />
      </div>
    </div>
  </div>
</template>

<script>

import Addresses from 'icmaa-checkout/components/Addresses'
import AddressComponent from 'theme/components/core/blocks/Checkout/Address'
import AddressPreview from 'theme/components/core/blocks/Checkout/Addresses/AddressPreview'
import CheckboxComponent from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Addresses',
  components: {
    AddressComponent,
    CheckboxComponent,
    ButtonComponent,
    AddressPreview
  },
  mixins: [ Addresses ]
}
</script>

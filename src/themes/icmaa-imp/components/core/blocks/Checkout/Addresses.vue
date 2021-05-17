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
        {{ $t('Use also as billing address.') }}
      </checkbox-component>
      <address-component
        type="billing"
        v-model="billingAddress"
        ref="billingAddress"
        v-if="!billingAddressIsSameAsShipping"
      />
      <pre>
      {{ shippingAddress }}
    </pre>
      <pre>
      {{ billingAddress }}
    </pre>
      <button-component
        class="t-w-full lg:t-w-auto"
        type="primary"
        @click.native.stop="submit"
      >
        {{ $t(('Continue to shipping')) }}
      </button-component>
    </form>
    <div class="" v-if="!active && done">
      Adresse kommt hier ...
    </div>
  </div>
</template>

<script>

import Addresses from 'icmaa-checkout/components/Addresses'
import AddressComponent from 'theme/components/core/blocks/Checkout/Address'
import CheckboxComponent from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Addresses',
  components: {
    AddressComponent,
    CheckboxComponent,
    ButtonComponent
  },
  mixins: [ Addresses ]
}
</script>

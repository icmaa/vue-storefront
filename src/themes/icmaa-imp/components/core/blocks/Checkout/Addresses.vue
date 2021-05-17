<template>
  <div class="addresses">
    <form v-if="active">
      <address-component />
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
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Addresses',
  components: {
    AddressComponent,
    ButtonComponent
  },
  mixins: [ Addresses ]
}
</script>

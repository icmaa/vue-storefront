<template>
  <div class="payment">
    <template class="" v-if="active">
      <div
        v-if="$v.selected.$error && (!$v.selected.required || !$v.selected.notFalse)"
        class="t-text-sm t-text-alert t-mb-4"
      >
        {{ $t('Please select a payment method.') }}
      </div>
      <div
        v-for="(method, index) in paymentMethods"
        :key="index"
        class="col-md-6"
        :class="[ method.code ]"
      >
        <base-checkbox
          :name="`paymentMethod[${method.code}]`"
          :id="`payment-method-${method.code}`"
          :input-value="method.code"
          :radio="true"
          v-model="selected"
        >
          {{ method.title || method.name }}
        </base-checkbox>
        <div
          v-if="method.code === selected && infoComponent"
          class="t-ml-8 t-mb-4"
        >
          <component :is="infoComponent" :code="method.code" />
        </div>
      </div>
      <button-component
        class="t-w-full lg:t-w-auto t-mt-8"
        type="primary"
        @click.native.stop="submit"
      >
        {{ $t(('Go review the order')) }}
      </button-component>
    </template>
    <template v-else-if="!active && done">
      <div class="t-text-sm" v-if="selectedMethod">
        {{ selectedMethod.title || selectedMethod.name }}
      </div>
    </template>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'
import Payment from 'icmaa-checkout/components/Payment'

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  mixins: [ Payment ],
  components: {
    BaseCheckbox,
    ButtonComponent
  },
  validations: {
    selected: {
      required,
      notFalse
    }
  }
}
</script>

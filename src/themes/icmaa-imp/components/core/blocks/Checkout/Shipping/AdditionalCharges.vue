<template>
  <div
    v-if="active"
    class="t-flex t-cursor-pointer t-flex-wrap t-items-center"
    :data-test-id="'AdditionalCharges' + upperFirst(charge.key)"
  >
    <base-checkbox
      :id="charge.key"
      v-model="selected"
      :name="'additionalCharges' + upperFirst(charge.key)"
      :checkbox-class="disabled ? '' : 't-self-start'"
    >
      <p :class="{ 't-font-bold': !disabled }">
        {{ charge.title }}
      </p>
      <p
        v-if="!disabled"
        class="t-text-xs t-text-base-tone"
      >
        {{ charge.description }},
        {{ price(charge.fee) }}
      </p>
    </base-checkbox>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { price } from 'icmaa-config/helpers/price'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import upperFirst from 'lodash-es/upperFirst'

export default {
  name: 'AdditionalShippingCharges',
  components: {
    BaseCheckbox
  },
  props: {
    value: {
      type: [ Boolean, String ],
      default: false
    },
    charge: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: false
    }
  },
  computed: {
    ...mapGetters({
      hasAdditionalShipping: 'checkout/hasAdditionalShippingCharge'
    }),
    active () {
      if (this.disabled) return this.selected
      return this.charge.enabled
    }
  },
  watch: {
    selected () {
      if (this.disabled) return
      this.$emit('input', this.selected)
    }
  },
  beforeMount () {
    this.selected = this.hasAdditionalShipping(this.charge.key)
  },
  methods: {
    price,
    upperFirst
  }
}
</script>

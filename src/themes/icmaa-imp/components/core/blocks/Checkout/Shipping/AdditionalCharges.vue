<template>
  <div
    class="t-flex t-items-center t-flex-wrap t-cursor-pointer"
    :data-test-id="'AdditionalCharges' + upperFirst(charge.key)"
    v-if="active"
  >
    <base-checkbox
      :name="'additionalCharges' + upperFirst(charge.key)"
      :id="charge.key"
      v-model="selected"
      :checkbox-class="disabled ? '' : 't-self-start'"
    >
      <p :class="{ 't-font-bold': !disabled }">
        {{ charge.title }}
      </p>
      <p class="t-text-base-tone t-text-xs" v-if="!disabled">
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
  methods: {
    price,
    upperFirst
  },
  watch: {
    selected () {
      if (this.disabled) return
      this.$emit('input', this.selected)
    }
  },
  beforeMount () {
    this.selected = this.hasAdditionalShipping(this.charge.key)
  }
}
</script>

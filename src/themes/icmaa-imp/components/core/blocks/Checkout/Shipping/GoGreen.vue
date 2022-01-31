<template>
  <div
    class="t-flex t-items-center t-flex-wrap t-cursor-pointer"
    v-if="active"
  >
    <base-checkbox
      name="goGreen"
      id="goGreen"
      v-model="selected"
      :checkbox-class="disabled ? '' : 't-self-start'"
    >
      <p :class="{ 't-font-bold': !disabled }">
        {{ goGreen.title }}
      </p>
      <p class="t-text-base-tone t-text-xs" v-if="!disabled">
        {{ goGreen.description }},
        {{ price(goGreen.fee) }}
      </p>
    </base-checkbox>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { price } from 'icmaa-config/helpers/price'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'

export default {
  name: 'GoGreen',
  components: {
    BaseCheckbox
  },
  props: {
    value: {
      type: [ Boolean, String ],
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
      goGreen: 'checkout/getGoGreen',
      hasGoGreen: 'checkout/hasGoGreen',
      getShippingMethod: 'checkout/getShippingMethods'
    }),
    shipping () {
      return this.getShippingMethod[0].code
    },
    active () {
      return this.goGreen && this.goGreen.enabled && this.goGreen.allowed_shipping_methods.includes(this.shipping)
    }
  },
  methods: {
    price
  },
  watch: {
    selected () {
      if (this.disabled) return
      this.$emit('input', this.selected)
    }
  },
  beforeMount () {
    this.selected = this.hasGoGreen
  }
}
</script>

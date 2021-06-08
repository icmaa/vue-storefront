<template>
  <div
    class="t-flex t-items-center t-flex-wrap t-cursor-pointer"
    v-if="active"
  >
    <base-checkbox
      name="priorityHandling"
      id="priorityHandling"
      v-model="selected"
      :checkbox-class="disabled ? '' : 't-self-start'"
    >
      <p :class="{ 't-font-bold': !disabled }">
        {{ priorityHandling.title }}
      </p>
      <p class="t-text-base-tone t-text-xs" v-if="!disabled">
        {{ priorityHandling.description }},
        {{ price(priorityHandling.fee) }}
      </p>
    </base-checkbox>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { price } from 'icmaa-config/helpers/price'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'

export default {
  name: 'PriorityHandling',
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
      priorityHandling: 'checkout/getPriorityHandling'
    }),
    active () {
      return this.priorityHandling && this.priorityHandling.enabled
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
    // Initial value here
    // this.selected = this.priorityHandling.selected
  }
}
</script>

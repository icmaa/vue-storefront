<template>
  <div>
    <div v-for="option in values" :key="'price-filter-' + option.id" @click="$emit('change', option)" class="t-cursor-pointer t-border-b t-border-base-lighter t-px-2 t-py-3">
      <button :aria-label="option.label" class="t-w-full t-text-sm t-flex t-items-center t-justify-between">
        {{ option.label }}
        <material-icon icon="check" class="t-leading-1-rem" v-if="isActiveOption(option)" />
      </button>
    </div>
  </div>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

import i18n from '@vue-storefront/i18n'
import { price } from 'icmaa-config/helpers/price'

export default {
  name: 'PriceSelector',
  mixins: [filterMixin],
  components: {
    MaterialIcon
  },
  mounted () {
    this.value = [this.startFromValue, this.startToValue]
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    attributeKey: {
      type: String,
      default: ''
    },
    attributeLabel: {
      type: String,
      default: ''
    }
  },
  computed: {
    values () {
      return this.options.map(o => {
        if (o.from > 0 && o.to) {
          o.label = `${price(o.from)} - ${price(o.to)}`
        } else if (o.from === 0) {
          o.label = i18n.t(`to {price}`, { price: price(o.to) })
        } else {
          o.label = i18n.t(`{price} and up`, { price: price(o.from) })
        }

        return o
      })
    }
  }
}
</script>

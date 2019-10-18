<template>
  <vue-slider v-model="value" :data="values" :marks="true" :enable-cross="false" :fixed="true" :lazy="true" tooltip="none" dot-size="24" :dot-style="{ boxShadow: 'none', border: '1px solid #999' }" :process-style="{ background: '#999' }" :label-style="{ fontSize: '.75rem', color: '#999', marginTop: '1rem' }" :label-active-style="{ color: '#000' }" />
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin'

import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'

export default {
  name: 'PriceSelector',
  mixins: [filterMixin],
  components: {
    VueSlider
  },
  data () {
    return {
      value: []
    }
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
    curFilter () {
      const filter = this.selectedFilters[this.attributeKey] || false
      return Array.isArray(filter) ? filter.pop() : filter
    },
    startFromValue () {
      if (this.curFilter) {
        return this.curFilter.from
      }

      return this.firstValue.from
    },
    startToValue () {
      if (this.curFilter) {
        return this.curFilter.to || this.maxValue
      }

      return this.firstValue.to
    },
    firstValue () {
      const options = this.options.slice(0, 1)
      return options.shift()
    },
    minValue () {
      return Math.min(...this.options.map(o => parseInt(o.from)))
    },
    maxValue () {
      return Math.max(...this.options.map(o => parseInt(o.from)))
    },
    values () {
      return this.options.map(o => parseInt(o.from))
    }
  },
  watch: {
    value (v, ov) {
      if (ov.length === 0) {
        return
      }

      const from = v[0]
      const to = v[1]

      let filter = {
        id: `${from}.0-${to}.0`,
        type: 'price',
        from,
        to,
        single: true
      }

      if (to === this.maxValue) {
        filter = this.options.slice(0).pop()
      }

      this.$emit('change', filter)
    }
  }
}
</script>

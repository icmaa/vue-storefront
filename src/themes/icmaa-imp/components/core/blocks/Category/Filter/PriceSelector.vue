<template>
  <vue-slider v-model="value" :data="values" :marks="true" :enable-cross="false" :lazy="true" />
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
    this.value = [this.curStartValue, this.curEndValue]
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
    curStartValue () {
      if (this.curFilter) {
        return this.curFilter.from
      }

      return this.minValue
    },
    curEndValue () {
      if (this.curFilter) {
        return this.curFilter.to || this.maxValue
      }

      return this.maxValue
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
      const to = v[1] === this.maxValue ? '*' : v[1]

      let id = `${from}.0-${to}`
      if (v[1] !== this.maxValue) {
        id = id + `.0`
      }

      this.$emit('change', {
        id,
        type: 'price',
        from: v[0],
        to: v[1],
        single: true
      })
    }
  }
}
</script>

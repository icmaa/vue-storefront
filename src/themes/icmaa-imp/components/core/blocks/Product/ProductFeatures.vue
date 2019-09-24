<template>
  <ul class="t-text-sm t-list-disc t-list-inside t-pl-2">
    <li v-for="(feature, index) in features" :key="index" :class="{ 't-mb-2': features.length -1 !== index }" v-html="feature" />
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import FeaturesMixin from 'theme/mixins/product/featuresMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  mixins: [ FeaturesMixin ],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getAttributeLabel: 'attribute/getAttributeLabel',
      getOptionLabel: 'attribute/getOptionLabel'
    }),
    featureValues () {
      const featureValues = []
      this.featureAttributes.forEach(attributeCode => {
        let values = this.product[attributeCode]
        if (!values || values === '' || (values.length === 1 && values[0] === '')) {
          return
        }

        featureValues.push({ attributeCode, values })
      })

      return featureValues
    },
    numerative () {
      return ['uk', 'en', 'us'].includes(currentStoreView().i18n.defaultLanguage.toLowerCase())
        ? 'imperial' : 'metric'
    },
    conversionValues () {
      return this.conversionAttributes.map(attributeCode => {
        let value = this.product[attributeCode]
        if (!value || value === '') {
          return false
        }

        let values = value.split('x')
        values = values.length > 0 ? values : [value]
        const conversionRate = this.conversionRate[attributeCode]
        const conversionUnit = this.conversionUnit[attributeCode]

        values = values.map(v => {
          return this.round(conversionRate * parseFloat(v)) + conversionUnit
        })

        value = values.join(' x ')
        const label = this.getAttributeLabel({ attributeKey: attributeCode })

        return { label, value }
      }).filter(a => a !== false)
    },
    conversionRate () {
      return this.conversionRates[this.numerative]
    },
    conversionUnit () {
      return this.conversionUnits[this.numerative]
    },
    features () {
      let features = []

      // Default features
      this.featureValues.forEach(option => {
        const attributeKey = option.attributeCode
        const optionLabels = option.values.map(optionId => this.getOptionLabel({ attributeKey, optionId }))
        features = [...features, ...optionLabels]
      })

      // Conversion values
      this.conversionValues.forEach(option => {
        features.push(`${option.label}: ${option.value}`)
      })

      return features
    }
  },
  methods: {
    round (v) {
      return Math.round(parseFloat(v) * 100) / 100
    }
  }
}
</script>

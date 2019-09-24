<template>
  <ul class="t-text-sm t-list-disc t-list-inside t-pl-2">
    <li v-for="(feature, index) in features" :key="index" :class="{ 't-mb-2': features.length -1 !== index }">
      {{ feature }}
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import ProductAttributes from 'theme/components/core/blocks/Product/ProductAttributes'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
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
    featureAttributes () {
      return [
        'features_backpacks',
        'features_headphones',
        'features_headwear',
        'features_pants',
        'features_shoes',
        'features_tops',
        'features_watches',
        'features_label',
        'features_specialpack',
        'features_media',
        'features_merchandise'
      ]
    },
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
    conversionAttributes () {
      return [
        'features_bp_measures',
        'features_bp_volume',
        'features_bp_weight'
      ]
    },
    conversionValues () {
      return this.conversionAttributes.map(attributeCode => {
        let value = this.product[attributeCode]
        if (!value || value === '') {
          return false
        }

        let values = value.split('x')
        values = values.length > 0 ? values : [value]
        const conversionRate = this.conversionRates[this.numerative][attributeCode]
        const conversionUnit = this.conversionUnits[this.numerative][attributeCode]

        values = values.map(v => {
          return (parseFloat(v) * conversionRate) + conversionUnit
        })

        value = values.join(' x ')
        const label = this.getAttributeLabel({ attributeKey: attributeCode })

        return { label, value }
      }).filter(a => a !== false)
    },
    conversionRates () {
      return {
        'metric': {
          'features_bp_measures': 1, // cm
          'features_bp_volume': 1, // liter
          'features_bp_weight': 1 // gramm
        },
        'imperial': {
          'features_bp_measures': 0.3937, // Zentimeter -> "
          'features_bp_volume': 61.0237, // Liter -> Kubikinch, in^3
          'features_bp_weight': 0.00220462262 // Gramm -> Pound, lb
        }
      }
    },
    conversionUnits () {
      return {
        'metric': {
          'features_bp_measures': 'cm',
          'features_bp_volume': ' l',
          'features_bp_weight': ' g'
        },
        'imperial': {
          'features_bp_measures': '"',
          'features_bp_volume': ' in&sup3;',
          'features_bp_weight': ' lb'
        }
      }
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
  }
}
</script>

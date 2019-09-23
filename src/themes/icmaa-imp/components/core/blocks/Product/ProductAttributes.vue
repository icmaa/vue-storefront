<template>
  <li class="t-flex">
    <span class="t-w-2/6 t-font-bold">{{ label|htmlDecode }} </span>
    <span class="t-w-4/6">
      <template v-for="(value, index) in values">
        <template v-if="value.optionLink">
          <router-link :to="value.optionLink" :title="label + ' - ' + value.optionLabel" class="t-text-base-dark" v-text="value.optionLabel" :key="'key-' + index" /><span v-if="valuesCount !== index" v-text="', '" :key="'spacer-' + index" />
        </template>
        <template v-else>
          <span v-text="value.optionLabel" :key="'key-' + index" /><span v-if="valuesCount !== index" v-text="', '" :key="'spacer-' + index" />
        </template>
      </template>
    </span>
  </li>
</template>

<script>
import config from 'config'

import { mapGetters } from 'vuex'
import { ProductAttribute } from '@vue-storefront/core/modules/catalog/components/ProductAttribute'

export default {
  name: 'ProductAttributes',
  data: function () {
    return {
      map: config.icmaa.catalog.attribute.category_links
    }
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    attribute: {
      type: null,
      required: true
    },
    emptyPlaceholder: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('attribute', { getOptionLabel: 'getOptionLabel' }),
    attributeCode () {
      return this.attribute.attribute_code
    },
    label () {
      return (this.attribute && this.attribute.frontend_label) ? this.attribute.frontend_label : ((this.attribute && this.attribute.default_frontend_label) ? this.attribute.default_frontend_label : '')
    },
    isMultiselect () {
      return this.attribute.frontend_input === 'multiselect' || this.attribute.frontend_input === 'select'
    },
    valuesRaw () {
      let values = this.product[this.attributeCode]

      if (!values) {
        return [this.emptyPlaceholder]
      } else if (!this.isMultiselect || typeof values !== 'object') {
        return [values.toString()]
      } else if (typeof values === 'string') {
        const split = values.split(',')
        return split.length > 0 ? split : [values]
      }

      return values
    },
    values () {
      return this.valuesRaw.map(optionId => {
        return {
          optionLabel: this.getOptionLabel({ attributeKey: this.attributeCode, optionId }),
          optionLink: (this.attributeLinks && this.attributeLinks[optionId]) ? this.attributeLinks[optionId] : false
        }
      })
    },
    valuesCount () {
      return this.values.length - 1
    },
    attributeLinks () {
      return this.map[this.attributeCode] || false
    }
  }
}
</script>

<template>
  <li
    v-if="values.length > 0"
    class="t-flex"
  >
    <span class="t-w-5/12 t-overflow-auto t-font-bold t-scrolling-touch lg:t-w-2/6">{{ label|htmlDecode }}</span>
    <span class="t-w-7/12 t-pl-2 lg:t-w-4/6">
      <template v-for="(value, index) in values">
        <template v-if="value.optionLink">
          <router-link
            :key="'key-' + index"
            :to="value.optionLink"
            :title="label + ' - ' + value.optionLabel"
            class="t-border-b t-border-base-dark t-text-base-dark"
            v-text="value.optionLabel"
          /><span
            v-if="valuesCount !== index"
            :key="'spacer-' + index"
            v-text="', '"
          />
        </template>
        <template v-else>
          <span
            :key="'key-' + index"
            v-text="value.optionLabel"
          /><span
            v-if="valuesCount !== index"
            :key="'spacer-' + index"
            v-text="', '"
          />
        </template>
      </template>
    </span>
  </li>
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'
import { date } from '@vue-storefront/core/filters/date'

export default {
  name: 'ProductAttributes',
  props: {
    product: {
      type: Object,
      required: true
    },
    attribute: {
      type: null,
      required: true
    }
  },
  data: function () {
    return {
      map: config.icmaa.catalog.attribute.category_links
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
    isSelect () {
      return ['multiselect', 'select'].includes(this.attribute.frontend_input)
    },
    isDate () {
      return ['date', 'datetime'].includes(this.attribute.frontend_input)
    },
    valuesRaw () {
      let values = this.product[this.attributeCode]

      if (this.isDate) {
        return [date(values)]
      } else if (typeof values === 'number') {
        return [`${values}`]
      } else if (typeof values === 'string') {
        const split = values.split(',')
        return split.length > 0 ? split : [values]
      }

      return values
    },
    values () {
      return this.valuesRaw.map(optionId => {
        return {
          optionLabel: this.isSelect ? this.getOptionLabel({ attributeKey: this.attributeCode, optionId }) : optionId,
          optionLink: (this.isSelect && this.attributeLinks && this.attributeLinks[optionId]) ? this.attributeLinks[optionId] : false
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

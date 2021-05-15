<template>
  <base-select
    :options="countryOptions"
    :initial-option-text="$t('Country')"
    v-bind="{ ...$props, ...$attrs }"
    :value="country"
    @input="$emit('input', $event)"
  />
</template>

<script>
import config from 'config'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { getTranslatedCountries } from 'icmaa-config/helpers/i18n/countries'

import get from 'lodash-es/get'

export default {
  name: 'CountrySelect',
  components: {
    BaseSelect
  },
  props: {
    value: {
      type: [Object, String],
      required: true
    },
    preselectStoreViewLanguage: {
      type: Boolean,
      default: true
    },
    onlyAllowed: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      countries: getTranslatedCountries()
    }
  },
  computed: {
    country () {
      if (!this.value && this.preselectStoreViewLanguage) {
        return currentStoreView().i18n.defaultCountry
      }
      return this.value
    },
    allowedCountries () {
      /**
       * We can't just use the values from `currentStoreView()`, because they are concatenated by
       * the lodash/merge method instead of overwritten – thats why we call them this way.
       */
      const storeConfigPath = `storeViews.${currentStoreView().storeCode}.i18n.allowedCountries`
      return get(config, storeConfigPath, config.i18n.allowedCountries || [])
    },
    countryOptions () {
      return this.countries
        .filter(({ code }) => !this.onlyAllowed || this.allowedCountries.includes(code))
        .map(({ code: value, name: label }) => ({ value, label }))
    }
  }
}
</script>

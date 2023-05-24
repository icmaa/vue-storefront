<template>
  <BaseSelect
    :options="countryOptions"
    :initial-option-text="$t('Country')"
    v-bind="{ ...$props, ...$attrs }"
    :value="country"
    @input="$emit('input', $event)"
  />
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'

import get from 'lodash-es/get'

export default {
  name: 'CountrySelect',
  components: {
    BaseSelect
  },
  props: {
    value: {
      type: [Object, String, null],
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
      country: this.value || ''
    }
  },
  computed: {
    ...mapGetters({
      countries: 'icmaaConfig/getCountries'
    }),
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
  },
  mounted () {
    if (!this.value && this.preselectStoreViewLanguage) {
      this.country = currentStoreView().i18n.defaultCountry
    }

    this.$emit('input', this.country)
  }
}
</script>

<template>
  <base-select
    :options="countryOptions"
    :initial-option-text="$t('Country')"
    v-bind="{ ...$props, ...$attrs }"
    :value="country"
    @input="(v) => $emit('input', v)"
  />
</template>

<script>
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { getTranslatedCountries } from 'icmaa-config/helpers/i18n/countries'

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
    ...mapGetters({
      storeConfig: 'icmaaConfig/getCurrentStoreConfig'
    }),
    country () {
      if (!this.value && this.preselectStoreViewLanguage) {
        return currentStoreView().i18n.defaultCountry
      }
      return this.value
    },
    countryOptions () {
      return this.countries
        .filter(({ code }) => !this.onlyAllowed || this.storeConfig.i18n.allowedCountries.includes(code))
        .map(({ code: value, name: label }) => ({ value, label }))
    }
  }
}
</script>

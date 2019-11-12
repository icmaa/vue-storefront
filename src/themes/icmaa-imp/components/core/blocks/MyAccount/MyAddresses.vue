<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="home">
      {{ $t('My addresses') }}
    </headline>
    <div class="list t-flex t-flex-wrap t-flex-grow t--m-2">
      <div v-for="(a, i) in addresses" :key="i">
        {{ a }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from 'config'
import i18n from '@vue-storefront/i18n'

import pick from 'lodash-es/pick'
import invert from 'lodash-es/invert'

import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators'
import { date } from 'icmaa-config/helpers/validators'
import { toDate } from 'icmaa-config/helpers/datetime'

import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'

const Countries = require('@vue-storefront/i18n/resource/countries.json')

export default {
  name: 'MyAdresses',
  data () {
    return {
      address: {

      },
      countries: Countries
    }
  },
  components: {
    Headline,
    BaseCheckbox,
    BaseSelect,
    BaseInput,
    ButtonComponent
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport',
      customer: 'user/getCustomer'
    }),
    addresses () {
      return this.customer.addresses
    },
    validation () {
      return this.$v.address
    },
    countryOptions () {
      return this.countries.map((item) => {
        return {
          value: item.code,
          label: item.name
        }
      })
    }
  },
  validations: {
    address: {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastName: {
        required
      },
      country: {
        required
      },
      street: {
        required,
        unicodeAlphaNum
      },
      house: {
        required,
        unicodeAlphaNum
      },
      postcode: {
        required,
        minLength: minLength(3)
      },
      city: {
        required,
        unicodeAlpha
      }
    }
  }
}
</script>

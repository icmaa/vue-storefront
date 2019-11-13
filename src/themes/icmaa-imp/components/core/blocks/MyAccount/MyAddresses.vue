<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="home">
      {{ $t('My addresses') }}
    </headline>

    <div class="list t-flex t-flex-wrap t-flex-grow t--mx-2" v-if="!edit">
      <div v-for="(a, i) in addresses" :key="i" class="t-flex t-w-1/2 t-px-2 t-cursor-pointer" @click="editAddress(a.entity_id)">
        <div class="t-w-full t-text-sm t-leading-snug">
          <p v-if="a.company" v-text="a.company" />
          <p>{{ a.prefix }} {{ a.firstname }} {{ a.lastname }} {{ a.suffix }}</p>
          <p>{{ a.street }}</p>
          <p>{{ a.postcode }} {{ a.city }}</p>
          {{ a.country.name }}
        </div>
      </div>
    </div>

    <div class="form" v-if="edit">
      <form @submit.prevent="submit" novalidate class="t-flex t-flex-wrap t--mx-2">
        <base-input
          name="firstname"
          id="firstname"
          autocomplete="given-name"
          v-model="address.firstname"
          :label="$t('First name') + ' *'"
          :validations="[
            {
              condition: !validation.firstname.required && validation.firstname.$error,
              text: $t('Field is required.')
            }
          ]"
          class="t-w-1/2 lg:t-w-1/4 t-px-2 t-mb-4"
        />
        <base-input
          name="lastname"
          id="lastname"
          autocomplete="family-name"
          v-model="address.lastname"
          :label="$t('Last name') + ' *'"
          :validations="[{
            condition: !validation.lastname.required && validation.lastname.$error,
            text: $t('Field is required.')
          }]"
          class="t-w-1/2 lg:t-w-1/4 t-px-2 t-mb-4"
        />
        <base-input
          name="company"
          id="company"
          autocomplete="company"
          v-model="address.company"
          :label="$t('Company name')"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
        />
        <base-input
          name="street[0]"
          id="street"
          autocomplete="street"
          v-model="address.street[0]"
          :label="$t('Street') + ' *'"
          :validations="[{
            condition: !validation.street.required && validation.street.$error,
            text: $t('Field is required.')
          }]"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
        />
        <base-input
          name="city"
          id="city"
          autocomplete="city"
          v-model="address.city"
          :label="$t('City') + ' *'"
          :validations="[{
            condition: !validation.city.required && validation.city.$error,
            text: $t('Field is required.')
          }]"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
        />
        <base-input
          name="postcode"
          id="postcode"
          autocomplete="postcode"
          v-model="address.postcode"
          :label="$t('Postcode') + ' *'"
          :validations="[{
            condition: !validation.postcode.required && validation.postcode.$error,
            text: $t('Field is required.')
          }]"
          class="t-w-1/2 lg:t-w-1/4 t-px-2 t-mb-4"
        />
        <base-select
          name="country_id"
          id="country_id"
          v-model="address.country_id"
          :options="countryOptions"
          :label="$t('Country') + ' *'"
          :initial-option-text="$t('Country')"
          :validations="[{
            condition: !validation.country_id.required && validation.country_id.$error,
            text: $t('Field is required.')
          }]"
          class="t-w-1/2 lg:t-w-1/4 t-px-2 t-mb-4"
        />
        <base-input
          name="telephone"
          id="telephone"
          autocomplete="telephone"
          v-model="address.telephone"
          :label="$t('Telephone')"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
        />
        <div class="t-px-2 t-w-full t-flex t-flex-wrap">
          <button-component :submit="true" type="primary" class="t-w-full lg:t-w-auto">
            {{ $t('Save address') }}
          </button-component>
          <button-component type="ghost" class="t-w-full t-mt-2 lg:t-mt-0 lg:t-ml-4 lg:t-w-auto" @click="back">
            {{ $t('Back') }}
          </button-component>
        </div>
      </form>
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
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'

const Countries = require('@vue-storefront/i18n/resource/countries.json')

export default {
  name: 'MyAdresses',
  data () {
    return {
      edit: false,
      address: {
        entity_id: '',
        company: '',
        prefix: '',
        firstname: '',
        lastname: '',
        suffix: '',
        street: [''],
        postcode: '',
        city: '',
        country_id: '',
        telephone: ''
      },
      countries: Countries
    }
  },
  components: {
    Headline,
    MaterialIcon,
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
      return this.customer.addresses.map(address => {
        let { entity_id, company, prefix, firstname, lastname, suffix, postcode, city, country_id } = address
        let country = this.countries.find(c => c.code === country_id)
        let street = address.street.filter(s => s.length > 0).join('<br>')

        return { entity_id, company, prefix, firstname, lastname, suffix, street, postcode, city, country }
      })
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
  methods: {
    editAddress (entity_id) {
      this.edit = true
      this.address = Object.assign({}, this.address, pick(
        this.customer.addresses.find(a => a.entity_id === entity_id),
        ...Object.keys(this.address)
      ))
    },
    submit () {
      this.validation.$touch()
      if (!this.validation.$invalid) {
        let address = this.address
        let customer = this.customer

        customer.addresses = customer.addresses.map(a => {
          if (a.entity_id === address.entity_id) {
            return Object.assign(a, address)
          }

          return a
        })

        this.$bus.$emit('myAccount-before-updateUser', customer)
      }

      return false
    },
    back () {
      this.edit = false
      this.address = {
        entity_id: '',
        company: '',
        prefix: '',
        firstname: '',
        lastname: '',
        suffix: '',
        street: [''],
        postcode: '',
        city: '',
        country_id: '',
        telephone: ''
      }
    }
  },
  validations: {
    address: {
      firstname: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastname: {
        required
      },
      country_id: {
        required
      },
      street: {
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
      },
      telephone: {
        unicodeAlphaNum
      }
    }
  }
}
</script>

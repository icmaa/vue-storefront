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
            },
            {
              condition: !validation.firstname.latin && validation.firstname.$error,
              text: $t('Invalid characters.')
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
          :validations="[
            {
              condition: !validation.lastname.required && validation.lastname.$error,
              text: $t('Field is required.')
            },
            {
              condition: !validation.lastname.latin && validation.lastname.$error,
              text: $t('Invalid characters.')
            }
          ]"
          class="t-w-1/2 lg:t-w-1/4 t-px-2 t-mb-4"
        />
        <base-input
          name="company"
          id="company"
          autocomplete="company"
          v-model="address.company"
          :label="$t('Company name')"
          :validations="[{
            condition: !validation.company.latin && validation.company.$error,
            text: $t('Invalid characters.')
          }]"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
        />
        <div class="t-w-full lg:t-w-1/2 t-px-2">
          <base-input
            v-for="(street,i) in address.street" :key="i"
            :name="`street[${i}]`"
            :id="`street-${i}`"
            autocomplete="street"
            v-model="address.street[i]"
            :label="i === 0 ? $t('Street') + ' *' : false"
            :validations="[
              {
                condition: houseNumberAdvice,
                text: $t('Forgot your house number?')
              },
              {
                condition: !validation.street.$each[i].required && validation.street.$error,
                text: $t('Field is required.')
              },
              {
                condition: (!validation.street.$each[i].latin || !validation.street.$each[i].streetname) && validation.street.$error,
                text: $t('Invalid characters.')
              }
            ]"
            class="t-w-full"
            :class="[ i === address.street.length - 1 ? 't-mb-4' : 't-mb-2' ]"
          />
        </div>
        <base-input
          name="city"
          id="city"
          autocomplete="city"
          v-model="address.city"
          :label="$t('City') + ' *'"
          :validations="[
            {
              condition: !validation.city.required && validation.city.$error,
              text: $t('Field is required.')
            },
            {
              condition: !validation.city.latin && validation.city.$error,
              text: $t('Invalid characters.')
            }
          ]"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
        />
        <base-input
          name="postcode"
          id="postcode"
          autocomplete="postcode"
          v-model="address.postcode"
          :label="$t('Postcode') + ' *'"
          :validations="[
            {
              condition: !validation.postcode.required && validation.postcode.$error,
              text: $t('Field is required.')
            },{
              condition: !validation.postcode.postcode && validation.postcode.$error,
              text: $t('This is not a valid postcode.')
            }
          ]"
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
        <div class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4">
          <base-input
            name="telephone"
            id="telephone"
            autocomplete="telephone"
            v-model="address.telephone"
            :label="$t('Telephone')"
            :validations="[{
              condition: !validation.telephone.unicodeAlphaNum && validation.telephone.$error,
              text: $t('Only alphanumeric characters are allowed.')
            }]"
          />
          <div class="t-mt-2 t-text-xs t-text-base-light t-leading-snug" v-if="['FR'].includes(countryId)">
            En cas de problème avec votre livraison, le coursier GLS peut vous contacter par téléphone pour décider d'une nouvelle date de livraison.
          </div>
        </div>
        <base-checkbox
          name="is_default_billing"
          id="is_default_billing"
          v-model="address.is_default_billing"
          class="t-w-full lg:t-w-1/2 t-px-2"
        >
          {{ $t('Use as my default billing address') }}
        </base-checkbox>
        <base-checkbox
          name="is_default_shipping"
          id="is_default_shipping"
          v-model="address.is_default_shipping"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
        >
          {{ $t('Use as my default shipping address') }}
        </base-checkbox>
        <div class="t-px-2 t-w-full t-flex t-flex-wrap t-justify-between">
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
import { latin, unicodeAlphaNum, streetname, postcode } from 'icmaa-config/helpers/validators'
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
        telephone: '',
        is_default_billing: false,
        is_default_shipping: false
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
    },
    countryId () {
      return this.address.country_id.length > 0 ? this.address.country_id : undefined
    },
    houseNumberAdvice () {
      const street = this.address.street.join('')
      return street.length > 8 && !/(\d)+/.test(street)
    }
  },
  methods: {
    editAddress (entity_id) {
      this.edit = true
      this.address = Object.assign({}, this.address, pick(
        this.customer.addresses.find(a => a.entity_id === entity_id),
        ...Object.keys(this.address)
      ))

      if (this.address.street.length > 1) {
        this.address.street = [this.address.street.join(' ')]
      }
    },
    submit () {
      this.validation.$touch()
      if (!this.validation.$invalid) {
        let address = this.address
        let customer = this.customer

        customer.addresses = customer.addresses.map(a => {
          if (a.entity_id === address.entity_id) {
            if (customer.addresses.length === 1) {
              address.default_billing = true
              address.default_shipping = true
            }
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
  validations () {
    return {
      address: {
        firstname: {
          required,
          latin
        },
        lastname: {
          required,
          latin
        },
        company: {
          latin
        },
        country_id: {
          required
        },
        street: {
          $each: {
            required,
            streetname,
            latin
          }
        },
        postcode: {
          required,
          postcode: postcode(this.countryId)
        },
        city: {
          required,
          latin
        },
        telephone: {
          unicodeAlphaNum
        }
      }
    }
  }
}
</script>

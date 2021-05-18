<template>
  <div class="address" :class="[ `address-${type}` ]">
    <div class="t-flex t-flex-wrap t--mx-2">
      <h3 class="t-w-full t-px-2 t-mb-4 t-font-light" v-text="label" v-if="label" />
      <address-select
        class="t-w-full t-px-2 t-mb-4"
        name="selected-address"
        :type="type"
        v-model="selectedAddress"
        :validations="[
          {
            condition: $v.selectedAddress.$error && !$v.selectedAddress.required,
            text: $t('Field is required.')
          }
        ]"
        v-if="hasAddresses"
      />
      <template v-if="isNewAddress">
        <base-input
          class="t-w-full t-px-2 t-mb-4"
          type="text"
          name="company"
          autocomplete="company"
          :placeholder="$t('Company name')"
          v-model.trim="address.company"
          :validations="[
            {
              condition: $v.address.company.$error && !$v.address.company.latin,
              text: $t('Invalid characters.')
            }
          ]"
        />
        <base-input
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
          type="text"
          name="firstname"
          :placeholder="$t('First name') + ' *'"
          autocomplete="given-name"
          v-model.trim="address.firstname"
          :validations="[
            {
              condition: $v.address.firstname.$error && !$v.address.firstname.required,
              text: $t('Field is required.')
            },
            {
              condition: $v.address.firstname.$error && !$v.address.firstname.latin,
              text: $t('Invalid characters.')
            }
          ]"
        />
        <base-input
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
          type="text"
          name="lastname"
          autocomplete="family-name"
          :placeholder="$t('Last name') + ' *'"
          v-model.trim="address.lastname"
          :validations="[
            {
              condition: $v.address.lastname.$error && !$v.address.lastname.required,
              text: $t('Field is required.')
            },
            {
              condition: $v.address.lastname.$error && !$v.address.lastname.latin,
              text: $t('Invalid characters.')
            }
          ]"
        />
        <div class="t-w-full t-px-2 t-mb-4">
          <base-input
            v-for="(street,i) in address.street" :key="i"
            :name="`street[${i}]`"
            :id="`street-${i}`"
            autocomplete="street"
            v-model="address.street[i]"
            :placeholder="i === 0 ? $t('Street') + ' *' : false"
            :validations="[
              {
                condition: houseNumberAdvice,
                text: $t('Forgot your house number?')
              },
              {
                condition: $v.address.street.$error && !$v.address.street.$each[i].required,
                text: $t('Field is required.')
              },
              {
                condition: $v.address.street.$error && !$v.address.street.$each[i].housenumber,
                text: $t('Please leave a space between your address and your housenumber.')
              },
              {
                condition: $v.address.street.$error && (!$v.address.street.$each[i].latin || !$v.address.street.$each[i].streetname),
                text: $t('Invalid characters.')
              }
            ]"
            class="t-w-full"
            :class="{ 't-mb-4': i === street.length - 1 }"
          />
        </div>
        <base-input
          class="t-w-full lg:t-w-2/3 t-px-2 t-mb-4"
          type="text"
          name="city"
          autocomplete="city"
          :placeholder="$t('City') + ' *'"
          v-model.trim="address.city"
          :validations="[
            {
              condition: $v.address.city.$error && !$v.address.city.required,
              text: $t('Field is required.')
            },
            {
              condition: $v.address.city.$error && !$v.address.city.latin,
              text: $t('Invalid characters.')
            }
          ]"
        />
        <base-input
          class="t-w-full lg:t-w-1/3 t-px-2 t-mb-4"
          type="text"
          name="postcode"
          autocomplete="postal-code"
          :placeholder="$t('Postcode') + ' *'"
          v-model.trim="address.postcode"
          :validations="[
            {
              condition: $v.address.postcode.$error && !$v.address.postcode.required,
              text: $t('Field is required.')
            },
            {
              condition: $v.address.postcode.$error && !$v.address.postcode.postcode,
              text: $t('This is not a valid postcode. Format: {code}', { code: postCodeFormat})
            }
          ]"
        />
        <base-select
          name="region_id"
          id="region_id"
          v-model="address.region_id"
          :initial-option-text="$t('State / Region') + ' *'"
          :options="states"
          :validations="[{
            condition: $v.address.region_id.$error && !$v.address.region_id.required,
            text: $t('Field is required.')
          }]"
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
          v-if="hasState"
        />
        <country-select
          class="t-w-full t-px-2 t-mb-4"
          :class="{ 'lg:t-w-1/2': hasState }"
          name="country_id"
          autocomplete="country-name"
          v-model="address.country_id"
          :placeholder="$t('Country') + ' *'"
          :validations="[
            {
              condition: $v.address.country_id.$error && !$v.address.country_id.required,
              text: $t('Field is required.')
            }
          ]"
        />
        <div class="t-w-full t-px-2 t-mb-4">
          <base-input
            type="text"
            name="telephone"
            autocomplete="tel"
            :placeholder="$t('Telephone')"
            v-model.trim="address.telephone"
            :validations="[
              {
                condition: $v.address.telephone.$error && !$v.address.telephone.unicodeAlphaNum,
                text: $t('Only alphanumeric characters are allowed.')
              }
            ]"
          />
          <div class="t-mt-2 t-text-xs t-text-base-light t-leading-snug" v-if="['FR'].includes(countryId)">
            Votre numéro de téléphone peut être nécessaire au livreur pour vous contacter en cas de soucis.
          </div>
        </div>
        <div v-if="hasVatId" class="t-w-full t-px-2 t-mb-4">
          <base-input
            name="vat_id"
            id="vat_id"
            autocomplete="vat_id"
            v-model="address.vat_id"
            :placeholder="$t('VAT number') + ' *'"
            :validations="[
              {
                condition: !$v.address.vat_id.required && $v.address.vat_id.$error,
                text: $t('Field is required.')
              }
            ]"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { latin, postcode, streetname, housenumber, unicodeAlphaNum } from 'icmaa-config/helpers/validators'

import Address from 'icmaa-checkout/components/Address'

import CountrySelect from 'theme/components/core/blocks/Form/CountrySelect'
import AddressSelect from 'theme/components/core/blocks/Form/AddressSelect'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'

export default {
  components: {
    AddressSelect,
    CountrySelect,
    BaseSelect,
    BaseInput
  },
  mixins: [ Address ],
  validations () {
    let address = {}

    if (this.isNewAddress) {
      const vatId = this.hasVatId ? {
        vat_id: { required }
      } : {}

      const regionId = this.hasState ? {
        region_id: { required }
      } : {}

      address = {
        company: {
          latin
        },
        firstname: {
          required,
          latin
        },
        lastname: {
          required,
          latin
        },
        street: {
          required,
          $each: {
            required,
            streetname,
            housenumber,
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
        country_id: {
          required
        },
        telephone: {
          unicodeAlphaNum
        },
        ...regionId,
        ...vatId
      }
    }

    let selectedAddress = this.hasAddresses ? { required } : {}

    return {
      ...selectedAddress,
      address
    }
  }
}

</script>

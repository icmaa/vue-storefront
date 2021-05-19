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
            text: $t('Field is required')
          }
        ]"
        v-if="hasAddresses"
      />
      <template v-if="isNewAddress">
        <base-checkbox
          class="t-w-full t-px-2 t-mb-4"
          name="poststation"
          id="poststation"
          v-model="address.poststation"
          v-if="hasPoststation"
        >
          {{ $t('Send to post station?') }}
        </base-checkbox>
        <template v-if="address.poststation">
          <base-input
            class="t-w-full t-px-2 t-mb-4"
            type="text"
            name="company"
            id="company"
            autocomplete="company"
            :placeholder="'Postnummer *'"
            v-model.trim="address.company"
            max-length="30"
            :validations="[
              {
                condition: $v.address.company.$error && !$v.address.company.required,
                text: $t('Field is required')
              },
              {
                condition: $v.address.company.$error && !$v.address.company.numeric,
                text: $t('Invalid characters')
              }
            ]"
          />
          <div class="t-w-full t-px-2 t-mb-4">
            <base-input
              v-for="(street,i) in address.street" :key="i"
              :name="`street[${i}]`"
              :id="`street-${i}`"
              autocomplete="street"
              max-length="30"
              :placeholder="i === 0 ? 'Packstation *' : false"
              v-model="address.street[i]"
              :validations="[
                {
                  condition: $v.address.street.$error && !$v.address.street.$each[i].required,
                  text: $t('Field is required')
                },
                {
                  condition: $v.address.street.$error && !$v.address.street.$each[i].poststation,
                  text: $t('Format: Packstation 000')
                }
              ]"
              class="t-w-full"
            />
          </div>
        </template>
        <base-input
          class="t-w-full t-px-2 t-mb-4"
          type="text"
          name="company"
          id="company"
          autocomplete="company"
          :placeholder="$t('Company name')"
          max-length="30"
          v-model.trim="address.company"
          :validations="[
            {
              condition: $v.address.company.$error && !$v.address.company.latin,
              text: $t('Invalid characters')
            }
          ]"
          v-if="!address.poststation"
        />
        <base-input
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
          type="text"
          name="firstname"
          id="firstname"
          :placeholder="$t('First name') + ' *'"
          autocomplete="given-name"
          max-length="30"
          v-model.trim="address.firstname"
          :validations="[
            {
              condition: $v.address.firstname.$error && !$v.address.firstname.required,
              text: $t('Field is required')
            },
            {
              condition: $v.address.firstname.$error && !$v.address.firstname.latin,
              text: $t('Invalid characters')
            }
          ]"
        />
        <base-input
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
          type="text"
          name="lastname"
          id="lastname"
          :placeholder="$t('Last name') + ' *'"
          autocomplete="family-name"
          max-length="30"
          v-model.trim="address.lastname"
          :validations="[
            {
              condition: $v.address.lastname.$error && !$v.address.lastname.required,
              text: $t('Field is required')
            },
            {
              condition: $v.address.lastname.$error && !$v.address.lastname.latin,
              text: $t('Invalid characters')
            }
          ]"
        />
        <div class="t-w-full t-px-2 t-mb-4" v-if="!address.poststation">
          <base-input
            v-for="(street,i) in address.street" :key="i"
            :name="`street[${i}]`"
            :id="`street-${i}`"
            :placeholder="i === 0 ? $t('Street') + ' *' : false"
            autocomplete="street"
            max-length="30"
            v-model="address.street[i]"
            :validations="[
              {
                condition: houseNumberAdvice,
                text: $t('Forgot your house number?')
              },
              {
                condition: $v.address.street.$error && !$v.address.street.$each[i].required,
                text: $t('Field is required')
              },
              {
                condition: $v.address.street.$error && !$v.address.street.$each[i].housenumber,
                text: $t('Please leave a space between your address and your housenumber.')
              },
              {
                condition: $v.address.street.$error && (!$v.address.street.$each[i].latin || !$v.address.street.$each[i].streetname),
                text: $t('Invalid characters')
              }
            ]"
            class="t-w-full"
          />
        </div>
        <base-input
          class="t-w-full lg:t-w-2/3 t-px-2 t-mb-4"
          type="text"
          name="city"
          id="city"
          :placeholder="$t('City') + ' *'"
          autocomplete="city"
          max-length="30"
          v-model.trim="address.city"
          :validations="[
            {
              condition: $v.address.city.$error && !$v.address.city.required,
              text: $t('Field is required')
            },
            {
              condition: $v.address.city.$error && !$v.address.city.latin,
              text: $t('Invalid characters')
            }
          ]"
        />
        <base-input
          class="t-w-full lg:t-w-1/3 t-px-2 t-mb-4"
          type="text"
          name="postcode"
          id="postcode"
          :placeholder="$t('Postcode') + ' *'"
          autocomplete="postal-code"
          v-model.trim="address.postcode"
          :validations="[
            {
              condition: $v.address.postcode.$error && !$v.address.postcode.required,
              text: $t('Field is required')
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
            text: $t('Field is required')
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
              text: $t('Field is required')
            }
          ]"
        />
        <div class="t-w-full t-px-2 t-mb-4">
          <base-input
            type="text"
            name="telephone"
            id="telephone"
            :placeholder="$t('Telephone')"
            autocomplete="tel"
            max-length="30"
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
            :placeholder="$t('VAT number') + ' *'"
            autocomplete="vat_id"
            v-model="address.vat_id"
            :validations="[
              {
                condition: !$v.address.vat_id.required && $v.address.vat_id.$error,
                text: $t('Field is required')
              }
            ]"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
import { latin, postcode, streetname, housenumber, unicodeAlphaNum, poststation } from 'icmaa-config/helpers/validators'

import Address from 'icmaa-checkout/components/Address'

import CountrySelect from 'theme/components/core/blocks/Form/CountrySelect'
import AddressSelect from 'theme/components/core/blocks/Form/AddressSelect'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'

export default {
  components: {
    AddressSelect,
    CountrySelect,
    BaseSelect,
    BaseInput,
    BaseCheckbox
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
          ...this.address.poststation
            ? { required, numeric }
            : { latin }
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
            latin,
            ...this.address.poststation
              ? { poststation }
              : { streetname, housenumber }
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
      selectedAddress,
      address
    }
  }
}

</script>

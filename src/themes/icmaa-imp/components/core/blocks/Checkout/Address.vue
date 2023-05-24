<template>
  <div
    class="address"
    :class="[ `address-${type}` ]"
  >
    <div class="t--mx-2 t-flex t-flex-wrap">
      <h3
        v-if="label"
        class="t-mb-4 t-w-full t-px-2 t-font-light"
        v-text="label"
      />
      <address-select
        v-if="hasAddresses"
        v-model="selectedAddress"
        class="t-mb-4 t-w-full t-px-2"
        name="selected-address"
        :type="type"
        :validations="[
          {
            condition: $v.selectedAddress.$error && !$v.selectedAddress.required,
            text: $t('Field is required')
          }
        ]"
      />
      <template v-if="isNewAddress">
        <base-checkbox
          v-if="hasPoststation"
          id="poststation"
          v-model="address.poststation"
          class="t-mb-4 t-w-full t-px-2"
          name="poststation"
        >
          {{ $t('Send to post station?') }}
        </base-checkbox>
        <template v-if="address.poststation">
          <base-input
            id="company"
            v-model.trim="address.company"
            class="t-mb-4 t-w-full t-px-2"
            type="text"
            name="company"
            autocomplete="company"
            :placeholder="'Postnummer *'"
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
          <div class="t-mb-4 t-w-full t-px-2">
            <base-input
              v-for="(street,i) in address.street"
              :id="`street-${i}`"
              :key="i"
              v-model="address.street[i]"
              :name="`street[${i}]`"
              autocomplete="street"
              max-length="30"
              :placeholder="i === 0 ? 'Packstation *' : false"
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
          v-if="!address.poststation"
          id="company"
          v-model.trim="address.company"
          class="t-mb-4 t-w-full t-px-2"
          type="text"
          name="company"
          autocomplete="company"
          :placeholder="$t('Company name')"
          max-length="30"
          :validations="[
            {
              condition: $v.address.company.$error && !$v.address.company.latin,
              text: $t('Invalid characters')
            }
          ]"
        />
        <base-input
          id="firstname"
          v-model.trim="address.firstname"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
          type="text"
          name="firstname"
          :placeholder="$t('First name') + ' *'"
          autocomplete="given-name"
          max-length="30"
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
          id="lastname"
          v-model.trim="address.lastname"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
          type="text"
          name="lastname"
          :placeholder="$t('Last name') + ' *'"
          autocomplete="family-name"
          max-length="30"
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
        <div
          v-if="!address.poststation"
          class="t-mb-4 t-w-full t-px-2"
        >
          <base-input
            v-for="(street,i) in address.street"
            :id="`street-${i}`"
            :key="i"
            v-model="address.street[i]"
            :name="`street[${i}]`"
            :placeholder="i === 0 ? $t('Street') + ' *' : false"
            autocomplete="street"
            max-length="30"
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
          id="postcode"
          v-model.trim="address.postcode"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
          type="text"
          name="postcode"
          :placeholder="$t('Postcode') + ' *'"
          autocomplete="postal-code"
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
        <base-input
          id="city"
          v-model.trim="address.city"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
          type="text"
          name="city"
          :placeholder="$t('City') + ' *'"
          autocomplete="city"
          max-length="30"
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
        <base-select
          v-if="hasState"
          id="region_id"
          v-model="address.region_id"
          name="region_id"
          :initial-option-text="$t('State / Region') + ' *'"
          :options="states"
          :validations="[{
            condition: $v.address.region_id.$error && !$v.address.region_id.required,
            text: $t('Field is required')
          }]"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
        />
        <country-select
          v-model="address.country_id"
          class="t-mb-4 t-w-full t-px-2"
          :class="{ 'lg:t-w-1/2': hasState }"
          name="country_id"
          autocomplete="country-name"
          :placeholder="$t('Country') + ' *'"
          :validations="[
            {
              condition: $v.address.country_id.$error && !$v.address.country_id.required,
              text: $t('Field is required')
            }
          ]"
        />
        <div class="t-mb-4 t-w-full t-px-2">
          <base-input
            id="telephone"
            v-model.trim="address.telephone"
            type="text"
            name="telephone"
            :placeholder="$t('Telephone')"
            autocomplete="tel"
            max-length="30"
            :validations="[
              {
                condition: $v.address.telephone.$error && !$v.address.telephone.unicodeAlphaNum,
                text: $t('Only alphanumeric characters are allowed.')
              }
            ]"
          />
          <div
            v-if="['FR'].includes(countryId)"
            class="t-mt-2 t-text-xs t-leading-snug t-text-base-light"
          >
            Votre numéro de téléphone peut être nécessaire au livreur pour vous contacter en cas de soucis.
          </div>
        </div>
        <div
          v-if="hasVatId"
          class="t-mb-4 t-w-full t-px-2"
        >
          <base-input
            id="vat_id"
            v-model="address.vat_id"
            name="vat_id"
            :placeholder="$t('VAT number') + ' *'"
            autocomplete="vat_id"
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

<template>
  <div
    class="t-bg-white t-p-4"
    data-test-id="MyAddresses"
  >
    <Headline>
      {{ $t('My addresses') }}
    </Headline>

    <div
      v-if="!edit"
      class="list t--mx-2 t-flex t-grow t-flex-wrap"
    >
      <div
        v-for="(a, i) in addresses"
        :key="i"
        class="t-mb-4 t-flex t-w-full t-cursor-pointer t-px-2 sm:t-w-1/2 lg:t-w-1/3"
        data-test-id="AddressBox"
        @click="editAddress(a.entity_id)"
      >
        <div class="t-w-full t-border t-border-base-lightest t-p-4 t-text-sm t-leading-snug">
          <p
            v-if="a.company"
            v-text="a.company"
          />
          <p>{{ a.prefix }} {{ a.firstname }} {{ a.lastname }} {{ a.suffix }}</p>
          <p>{{ a.street }}</p>
          <p>{{ a.postcode }} {{ a.city }}</p>
          {{ a.country.name }}
          <div
            v-if="a.is_default_billing || a.is_default_shipping"
            class="t-mt-2"
          >
            <div
              v-if="a.is_default_billing"
              class="t-text-xs t-text-base-light"
            >
              <MaterialIcon
                icon="check"
                size="xs"
                class="t-inline-flex t-align-bottom"
              />
              {{ $t('Default billing address') }}
            </div>
            <div
              v-if="a.is_default_shipping"
              class="t-text-xs t-text-base-light"
            >
              <MaterialIcon
                icon="check"
                size="xs"
                class="t-inline-flex t-align-bottom"
              />
              {{ $t('Default shipping address') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="addresses.length === 0"
        class="t-mb-4 t-flex t-w-full t-cursor-pointer t-px-2 sm:t-w-1/2 lg:t-w-1/3"
        @click="editAddress(true)"
      >
        <div class="t-flex t-h-32 t-w-full t-flex-wrap t-items-center t-border t-border-base-lightest t-p-4 t-text-sm t-leading-snug">
          <div class="t-w-full">
            <div>{{ $t('There are no addresses yet.') }}</div>
            <div class="t-text-base-light">
              {{ $t('Click here to add a new one') }}
            </div>
          </div>
        </div>
      </div>
      <div class="t-w-full t-px-2">
        <ButtonComponent
          data-test-id="AddNewAddressButton"
          @click="editAddress(true)"
        >
          {{ $t('New address') }}
        </ButtonComponent>
      </div>
    </div>

    <div
      v-if="edit"
      class="form"
      data-test-id="MyAddressesForm"
    >
      <form
        novalidate
        class="t--mx-2 t-flex t-flex-wrap"
        @submit.prevent="submit"
      >
        <BaseInput
          id="firstname"
          v-model="address.firstname"
          name="firstname"
          autocomplete="given-name"
          :label="$t('First name') + ' *'"
          :validations="[
            {
              condition: !validation.firstname.required && validation.firstname.$error,
              text: $t('Field is required')
            },
            {
              condition: !validation.firstname.latin && validation.firstname.$error,
              text: $t('Invalid characters')
            }
          ]"
          class="t-mb-4 t-w-1/2 t-px-2 lg:t-w-1/4"
        />
        <BaseInput
          id="lastname"
          v-model="address.lastname"
          name="lastname"
          autocomplete="family-name"
          :label="$t('Last name') + ' *'"
          :validations="[
            {
              condition: !validation.lastname.required && validation.lastname.$error,
              text: $t('Field is required')
            },
            {
              condition: !validation.lastname.latin && validation.lastname.$error,
              text: $t('Invalid characters')
            }
          ]"
          class="t-mb-4 t-w-1/2 t-px-2 lg:t-w-1/4"
        />
        <BaseInput
          id="company"
          v-model="address.company"
          name="company"
          autocomplete="company"
          :label="$t('Company name')"
          :validations="[{
            condition: !validation.company.latin && validation.company.$error,
            text: $t('Invalid characters')
          }]"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
        />
        <div class="t-w-full t-px-2 lg:t-w-1/2">
          <BaseInput
            v-for="(street,i) in address.street"
            :id="`street-${i}`"
            :key="i"
            v-model="address.street[i]"
            :name="`street[${i}]`"
            autocomplete="street"
            :label="i === 0 ? $t('Street') + ' *' : false"
            :validations="[
              {
                condition: houseNumberAdvice,
                text: $t('Forgot your house number?')
              },
              {
                condition: !validation.street.$each[i].required && validation.street.$error,
                text: $t('Field is required')
              },
              {
                condition: !validation.street.$each[i].housenumber && validation.street.$error,
                text: $t('Please leave a space between your address and your housenumber.')
              },
              {
                condition: (!validation.street.$each[i].latin || !validation.street.$each[i].streetname) && validation.street.$error,
                text: $t('Invalid characters')
              }
            ]"
            class="t-w-full"
            :class="[ i === address.street.length - 1 ? 't-mb-4' : 't-mb-2' ]"
          />
        </div>
        <BaseInput
          id="city"
          v-model="address.city"
          name="city"
          autocomplete="city"
          :label="$t('City') + ' *'"
          :validations="[
            {
              condition: !validation.city.required && validation.city.$error,
              text: $t('Field is required')
            },
            {
              condition: !validation.city.latin && validation.city.$error,
              text: $t('Invalid characters')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
        />
        <BaseInput
          id="postcode"
          v-model="address.postcode"
          name="postcode"
          autocomplete="postcode"
          :label="$t('Postcode') + ' *'"
          :validations="[
            {
              condition: !validation.postcode.required && validation.postcode.$error,
              text: $t('Field is required')
            },{
              condition: !validation.postcode.postcode && validation.postcode.$error,
              text: $t('This is not a valid postcode. Format: {code}', { code: postCodeFormat})
            }
          ]"
          :class="[ hasState ? 't-w-full lg:t-w-1/2' : 't-w-1/2 lg:t-w-1/4']"
          class="t-mb-4 t-px-2"
        />
        <BaseSelect
          v-if="hasState"
          id="region_id"
          v-model="address.region_id"
          name="region_id"
          :initial-option-text="$t('State / Region')"
          :label="$t('State / Region') + ' *'"
          :options="states"
          :validations="[{
            condition: !validation.region_id.required && validation.region_id.$error,
            text: $t('Field is required')
          }]"
          class="t-mb-4 t-w-1/2 t-px-2 lg:t-w-1/4"
        />
        <CountrySelect
          id="country_id"
          v-model="address.country_id"
          name="country_id"
          :label="$t('Country') + ' *'"
          :validations="[{
            condition: !validation.country_id.required && validation.country_id.$error,
            text: $t('Field is required')
          }]"
          class="t-mb-4 t-w-1/2 t-px-2 lg:t-w-1/4"
        />
        <div class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2">
          <BaseInput
            id="telephone"
            v-model="address.telephone"
            name="telephone"
            autocomplete="telephone"
            :label="$t('Telephone')"
            :validations="[{
              condition: !validation.telephone.unicodeAlphaNum && validation.telephone.$error,
              text: $t('Only alphanumeric characters are allowed.')
            }]"
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
          class="t-mb-4 t-w-full"
        >
          <BaseInput
            id="vat_id"
            v-model="address.vat_id"
            name="vat_id"
            autocomplete="vat_id"
            :label="$t('VAT number') + ' *'"
            :validations="[
              {
                condition: !validation.vat_id.required && validation.vat_id.$error,
                text: $t('Field is required')
              }
            ]"
            class="t-w-full t-px-2 lg:t-w-1/2"
          />
        </div>
        <div class="t-w-full" />
        <BaseCheckbox
          id="is_default_billing"
          v-model="address.is_default_billing"
          name="is_default_billing"
          class="t-w-full t-px-2 lg:t-w-1/2"
          :disabled="customerAddress && customerAddress.is_default_billing"
          data-test-id="IsDefaultBillingCheckbox"
        >
          {{ $t('Use as my default billing address') }}
        </BaseCheckbox>
        <BaseCheckbox
          id="is_default_shipping"
          v-model="address.is_default_shipping"
          name="is_default_shipping"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
          :disabled="customerAddress && customerAddress.is_default_shipping"
          data-test-id="IsDefaultShippingCheckbox"
        >
          {{ $t('Use as my default shipping address') }}
        </BaseCheckbox>
        <div class="t-flex t-w-full t-flex-wrap t-justify-between t-px-2">
          <ButtonComponent
            :submit="true"
            type="primary"
            class="t-w-full lg:t-order-3 lg:t-w-auto"
            data-test-id="SubmitButton"
          >
            {{ $t('Save address') }}
          </ButtonComponent>
          <ButtonComponent
            type="ghost"
            icon="keyboard_arrow_left"
            icon-position="left"
            class="t-mt-4 t-w-1/2 t-flex-1 lg:t-order-1 lg:t-mt-0 lg:t-w-auto lg:t-flex-fix"
            data-test-id="BackButton"
            @click="back"
          >
            {{ $t('Back') }}
          </ButtonComponent>
          <div
            v-if="!isNewAddress && !isDefaultAddress && address.entity_id"
            class="t-w-1/2 t-flex-1 t-pl-4 lg:t-order-2"
          >
            <ButtonComponent
              type="ghost"
              icon="delete"
              icon-position="left"
              class="t-mt-4 t-w-full lg:t-mt-0 lg:t-w-auto "
              :confirm="true"
              data-test-id="DeleteButton"
              @click="deleteAddress(address.entity_id)"
            >
              {{ $t('Delete') }}
            </ButtonComponent>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'

import pick from 'lodash-es/pick'

import { required } from 'vuelidate/lib/validators'
import { latin, unicodeAlphaNum, streetname, housenumber, postcode } from 'icmaa-config/helpers/validators'

import AddressMixin from 'theme/mixins/user/addressMixin'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'
import CountrySelect from 'theme/components/core/blocks/Form/CountrySelect'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'MyAdresses',
  components: {
    Headline,
    BaseInput,
    BaseSelect,
    BaseCheckbox,
    ButtonComponent,
    CountrySelect,
    MaterialIcon
  },
  mixins: [ AddressMixin ],
  data () {
    return {
      edit: false,
      isNewAddress: false,
      isDelete: false,
      address: {}
    }
  },
  computed: {
    ...mapGetters({
      customer: 'user/getCustomer'
    }),
    addresses () {
      return this.customer.addresses.map(address => {
        let { entity_id, company, prefix, firstname, lastname, suffix, postcode, city, country_id, is_default_billing, is_default_shipping, region_id } = address
        let country = this.countries.find(c => c.code === country_id)
        let street = address.street.filter(s => s.length > 0).join('<br>')

        return { entity_id, company, prefix, firstname, lastname, suffix, street, postcode, city, country, is_default_billing, is_default_shipping, region_id }
      })
    },
    validation () {
      return this.$v.address
    },
    customerAddress () {
      return this.customer.addresses.find(a => a.entity_id === this.address.entity_id)
    },
    isDefaultAddress () {
      let address = this.customerAddress
      return address && (address.is_default_billing === true || address.is_default_shipping === true)
    }
  },
  beforeMount () {
    this.$bus.$on('myAccount-after-updateUser-success', this.onAfterUpdateUserSuccess)
  },
  mounted () {
    this.setAddressDefaults()
  },
  destroyed () {
    this.$bus.$off('myAccount-after-updateUser-success', this.onAfterUpdateUserSuccess)
  },
  methods: {
    editAddress (entity_id) {
      this.edit = true
      this.isNewAddress = entity_id === true
      this.validation.$reset()

      this.address = Object.assign({}, this.address, pick(
        this.customer.addresses.find(a => a.entity_id === entity_id),
        ...Object.keys(this.address)
      ))

      if (this.address.street.length > 0) {
        this.address.street = [this.address.street.join(' ')]
      }
    },
    submit () {
      this.validation.$touch()
      if (!this.validation.$invalid) {
        let address = this.address
        let customer = this.customer

        if (customer.addresses.length < 1) {
          address.is_default_billing = true
          address.is_default_shipping = true
        }

        ['is_default_billing', 'is_default_shipping'].forEach(key => {
          if (address[key] === true) {
            customer.addresses.map(a => {
              a[key] = false
              return a
            })
          }
        })

        if (!this.hasVatId) {
          address.vat_id = null
        }

        if (!this.hasState) {
          address.region_id = null
        }

        customer.addresses = customer.addresses
          .map(a => a.entity_id === address.entity_id ? Object.assign(a, address) : a)

        if (this.isNewAddress || !address.entity_id) {
          customer.addresses.push(address)
        }

        this.$bus.$emit('myAccount-before-updateUser', customer)
      }

      return false
    },
    deleteAddress (entity_id) {
      if (this.isDefaultAddress) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: i18n.t('Can\'t delete a default shipping nor billing address.'),
          action1: { label: i18n.t('OK') }
        })
        return
      }

      let customer = this.customer
      customer.addresses = customer.addresses
        .map(a => {
          if (a.entity_id === entity_id) {
            a.delete = true
          }
          return a
        })

      this.isDelete = true

      this.$bus.$emit('myAccount-before-updateUser', customer)
    },
    back () {
      this.edit = false
      this.setAddressDefaults()
    },
    onAfterUpdateUserSuccess () {
      if (this.isNewAddress) {
        const lastAddress = this.customer.addresses.slice(-1).pop()
        this.editAddress(lastAddress.entity_id)
        return
      }

      if (this.isDelete) {
        this.isDelete = false
        this.back()
        return
      }

      this.editAddress(this.address.entity_id)
    }
  },
  validations () {
    const vatId = this.hasVatId ? {
      vat_id: { required }
    } : {}

    const regionId = this.hasState ? {
      region_id: { required }
    } : {}

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
        telephone: {
          unicodeAlphaNum
        },
        ...regionId,
        ...vatId
      }
    }
  }
}
</script>

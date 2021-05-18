<template>
  <base-select
    :options="addressOptions"
    :initial-option-text="$t('Select an address')"
    v-if="hasAddresses"
    v-bind="{ ...$props, ...$attrs }"
    v-model.number="addressId"
    @input="input"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'

export default {
  name: 'AddressSelect',
  components: {
    BaseSelect
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    type: {
      type: String,
      default: 'shipping'
    }
  },
  data () {
    return {
      addressId: this.value || ''
    }
  },
  mounted () {
    if (!this.hasAddresses) return

    const defaultAddress = this.addresses.find(a => a['is_default_' + this.type])
    if (defaultAddress) {
      this.addressId = defaultAddress.id
      this.$emit('input', this.addressId)
    }
  },
  computed: {
    ...mapGetters({
      addresses: 'user/getAddresses',
      getCountryNameByCode: 'icmaaConfig/getCountryNameByCode'
    }),
    hasAddresses () {
      return this.addresses && this.addresses.length > 0
    },
    addressOptions () {
      const addresses = this.addresses.map(a => {
        const { id: value } = a
        const label = [
          a.company || `${a.firstname} ${a.lastname}`,
          a.street,
          `${a.postcode} ${a.city}`,
          this.getCountryNameByCode(a.country_id)
        ].join(', ')

        return { value, label }
      })

      addresses.unshift({
        label: i18n.t('New address'), value: 0
      })

      return addresses
    }
  },
  methods: {
    input (v, e) {
      if (v !== 'new') v = parseInt(v)
      this.$emit('input', v, e)
    }
  }
}
</script>

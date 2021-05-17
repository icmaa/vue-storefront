<template>
  <base-select
    :options="addressOptions"
    :initial-option-text="$t('Address')"
    v-if="hasAddresses"
    v-bind="{ ...$props, ...$attrs }"
    v-model="addressId"
    @input="$emit('input', $event)"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'

export default {
  name: 'AddressSelect',
  components: {
    BaseSelect
  },
  props: {
    value: {
      type: [Boolean, String],
      default: false
    }
  },
  data () {
    return {
      addressId: this.value || ''
    }
  },
  computed: {
    ...mapGetters({
      addresses: 'user/getAddresses'
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
          a.country_id
        ].join(', ')

        return { value, label }
      })

      return addresses
    }
  }
}
</script>

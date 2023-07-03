<template>
  <div class="t--mx-8 t--mt-8 t-mb-8 t-bg-base-tone t-px-8 t-py-4 t-text-sm t-text-white">
    <MaterialIcon
      icon="alarm"
      size="sm"
      class="t-absolute t--ml-6"
    />
    <span class="t-font-bold">{{ $t('Notice') }}: </span>
    <span class="description t-mr-2">
      {{ preorderText }}
      {{ $t('This also applies to all other items in your order that would be directly available.') }}
    </span>
    <router-link
      :to="localizedRoute('service-preorder')"
      class="t-underline"
    >
      {{ $t('Read more') }}
    </router-link>
  </div>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import { toDate } from 'icmaa-config/helpers/datetime'
import i18n from '@vue-storefront/i18n'

export default {
  components: {
    MaterialIcon
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    preorderText () {
      if (this.hasPreorderDate) {
        return i18n.t('Delivery of your complete order not before {date}.', { date: this.preorderDate })
      }
      return i18n.t('Delivery of your complete order not before official release.')
    },
    hasPreorderDate () {
      return this.product.preorder_date || false
    },
    preorderDate () {
      return toDate(this.product.preorder_date)
    }
  }
}
</script>

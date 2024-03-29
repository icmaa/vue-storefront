<template>
  <div v-if="product">
    <ProductTile
      :product="product"
      :show-price="false"
    >
      <template #imageOverlay>
        <ButtonComponent
          type="transparent"
          :rounded="false"
          icon="close"
          icon-position="right"
          :icon-only="true"
          :confirm="true"
          padding-x="t-px-2 lg:t-px-3"
          class="t-absolute t-bottom-0 t-right-0 t-z-1 t-bg-white lg:t-h-12"
          @click="removeAlert"
        >
          {{ $t('Delete') }}
        </ButtonComponent>
      </template>
    </ProductTile>
    <div
      v-if="options.length > 0"
      class="t-mt-2"
    >
      <div
        v-for="(option, i) in options"
        :key="i"
        class="t-flex t-items-center"
      >
        <span
          class="t-mr-2 t-text-xs"
          v-text="option.label + ':'"
        />
        <ButtonComponent
          type="tag"
          size="xs"
          :cursor-pointer="false"
          class="t-mr-2"
        >
          {{ option.value }}
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'
import { formatProductLink } from 'icmaa-url/helpers'
import i18n from '@vue-storefront/i18n'

import ProductTile from 'theme/components/core/ProductTile'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MyProductsAlertProduct',
  components: {
    ProductTile,
    ButtonComponent
  },
  props: {
    stockItemId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getOptionLabel: 'attribute/getOptionLabel',
      getParentProductByStockItem: 'icmaaProductAlert/getParentProductByStockItem',
      getProducts: 'icmaaProductAlert/getProducts'
    }),
    product () {
      return this.getParentProductByStockItem(this.stockItemId)
    },
    productId () {
      return this.product.id
    },
    childProduct () {
      return this.product.configurable_children.find(el => el.id === this.stockItemId)
    },
    options () {
      const options = []
      this.product.configurable_options.forEach(o => {
        const attributeKey = o.attribute_code
        const label = /size/.test(attributeKey) ? i18n.t('Size') : o.label
        const optionId = this.childProduct[o.attribute_code]
        const value = this.getOptionLabel({ attributeKey, optionId })
        options.push({ label, value })
      })

      return options
    }
  },
  methods: {
    async removeAlert () {
      await this.$store.dispatch('icmaaProductAlert/removeProductStockAlert', this.stockItemId)
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t('You successfully unsupscripted for this stock notification.'),
        action1: { label: i18n.t('OK') }
      })
    }
  }
}
</script>

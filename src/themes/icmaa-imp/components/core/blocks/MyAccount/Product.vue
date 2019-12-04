<template>
  <div v-if="product">
    <product-tile :product="product" />
    <div class="t-flex t-items-center t-justify-between t-mt-2">
      <div v-if="options.length > 0" class="t-flex-grow t-text-sm t-text-base-tone">
        <button-component v-for="(option, i) in options" :key="i" type="ghost" size="sm" :cursor-pointer="false" v-text="option.value" class="t-mr-2" />
      </div>
      <button-component type="second" icon="delete" :icon-only="true" :confirm="true" @click="removeAlert">
        {{ $t('Delete') }}
      </button-component>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'
import i18n from '@vue-storefront/i18n'

import ProductTile from 'theme/components/core/ProductTile'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
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
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    thumbnail () {
      return this.getThumbnail(this.product.image, 150, 150)
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

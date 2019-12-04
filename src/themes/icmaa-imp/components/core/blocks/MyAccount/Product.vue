<template v-if="product">
  <div class="t-flex t-py-2">
    <div class="t-w-1/3 lg:t-w-1/4 t-flex t-items-center t-mr-4">
      <router-link :to="productLink">
        <product-image :image="image" />
      </router-link>
    </div>
    <div class="t-w-2/3 lg:t-w-3/4 lg:t-py-4 t-py-2">
      <div class="t-mb-2 t-w-full">
        <router-link :to="productLink" class="t-text-primary t-w-full t-text-sm t-leading-tight">
          {{ product.name | htmlDecode }}
        </router-link>
      </div>
      <div v-if="options.length > 0" class="t-text-sm t-text-base-tone t-mb-4">
        <div v-for="(option, i) in options" :key="i" v-text="option" />
      </div>
      <button-component type="second" icon="delete" :confirm="true" @click="removeAlert">
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
import ButtonComponent from 'theme/components/core/blocks/Button'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import ProductImage from 'theme/components/core/ProductImage'
import intersection from 'lodash-es/intersection'

export default {
  mixins: [Product],
  components: {
    ProductImage,
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
        const optionId = this.childProduct[o.attribute_code]
        options.push([o.label, this.getOptionLabel({ attributeKey, optionId })].join(': '))
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
    removeAlert () {
      this.$store.dispatch('icmaaProductAlert/removeProductStockAlert', this.stockItemId)
    }
  }
}
</script>

<template v-if="product">
  <div class="t-flex t-py-2">
    <div class="t-w-1/3 lg:t-w-1/4 t-flex t-items-center t-mr-4">
      <router-link :to="productLink">
        <product-image :image="image" />
      </router-link>
    </div>
    <div class="t-w-2/3 lg:t-w-3/4 t-flex t-flex-col lg:t-py-4 t-py-2">
      <div class="t-mb-2 lg:t-mb-4 t-w-full">
        <router-link :to="productLink" class="t-text-primary t-w-full t-text-sm t-leading-tight">
          {{ product.name | htmlDecode }}
        </router-link>
      </div>
      <div class="t-w-full t-text-sm t-font-bold">
        {{ $t("You're waiting for") }}
      </div>
      <div class="t-flex-grow">
        <template v-if="optionLabels.length > 0">
          <button-component v-for="(label, i) in optionLabels" :key="i" type="tag" size="sm" :class="'t-flex-fix t-mr-2 t-mb-2'" :icon-only="false">
            {{ label }}
          </button-component>
        </template>
      </div>
      <button-component type="second" size="md" :class="'t-mr-2'" icon="delete" :icon-only="false" @click.native="removeAlert">
        {{ $t('Delete notification') }}
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
    product: {
      type: Object,
      required: true
    },
    productId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({ attributeList: 'attribute/getAttributeListByCode' }),
    optionLabels () {
      const attributeList = this.attributeList
      const attributeCode = this.getAttributeCodes()

      const options = intersection(attributeCode, Object.keys(attributeList))
      if (options.length > 0) {
        const labels = []
        for (const option of options) {
          labels.push(attributeList[option].options.find(el => parseInt(el.value) === this.getChildProduct()[option]).label)
        }
        return labels
      }
      return [this.getChildProduct().sku]
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
    getChildProduct () {
      return this.product.configurable_children.find(el => el.id === this.productId)
    },
    redirect () {
      this.$router.push(this.localizedRoute(this.productLink))
    },
    removeAlert () {
      this.$store.dispatch('icmaaProductAlert/removeProductStockAlert', this.productId) // remove productId from backend
      this.$store.dispatch('icmaaProductAlert/removeProductByProductId', this.productId) // remove product data from state

      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: this.$t('Removed product alert')
      })
    },
    getAttributeCodes () {
      const attributeCodes = this.product.configurable_options.map(el => el.attribute_code)
      return attributeCodes
    }
  },
  async mounted () {
    this.$store.dispatch('attribute/list', { filterValues: [...this.getAttributeCodes()] })
  }
}
</script>

import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { googleTagManager } from 'config'
import AbstractMixin from './abstractMixin'

export default {
  mixins: [ AbstractMixin ],
  computed: {
    ...mapGetters({
      categoryProducts: 'category-next/getCategoryProducts'
    }),
    products () {
      return this.categoryProducts
        .slice(0, googleTagManager.categoryProductCount)
        .map(p => this.getGTMProductDTO(p, googleTagManager.categoryAttributes))
    }
  },
  watch: {
    products () {
      this.categoryGtm()
    }
  },
  methods: {
    categoryGtm () {
      if (!this.enabled && this.products.length > 0) {
        return
      }

      const GTM: VueGtm = (Vue as any).gtm
      GTM.trackEvent({
        event: 'icmaa-category-view',
        ecommerce: {
          detail: {
            actionField: { list: '' },
            products: this.products
          }
        }
      })
    }
  },
  mounted () {
    this.categoryGtm()
  }
}

<template>
  <main class="t-bg-base-lightest">
    <div id="category">
      <div class="t-container">
        <div class="t-flex t-flex-wrap t-px-4 t-mb-8">
          <div class="t-flex t-flex-wrap t-items-center t--mx-1 lg:t--mx-2">
            <h1 class="lg:t-block t-w-3/4 t-px-1 lg:t-px-2 t-my-4 t-font-light t-text-2xl t-text-base-dark">
              {{ category.name }}
            </h1>
          </div>
        </div>
      </div>
      <div class="t-container">
        <div class="">
          <div v-if="isCategoryEmpty" class="hidden-xs">
            <h4 data-testid="noProductsInfo">
              {{ $t('No products found!') }}
            </h4>
            <p>{{ $t('Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!') }}</p>
          </div>
          <product-listing columns="4" :products="getCategoryProducts" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import rootStore from '@vue-storefront/core/store'
import { mapGetters, mapState } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'

import ProductListing from '../components/core/ProductListing.vue'

import CategoryMixin from 'icmaa-catalog/components/Category'
import CategoryMetaMixin from 'icmaa-meta/mixins/categoryMeta'
import CategoryGtmMixin from 'icmaa-google-tag-manager/mixins/categoryGtm'
import ClusterMixin from 'icmaa-user/mixins/cluster'

const FilterSidebar = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-categoryfilter" */ 'theme/components/core/blocks/Category/Sidebar')
const ProductListingTicket = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-product-listing-ticket" */ 'theme/components/core/ProductListingTicket')

const composeInitialPageState = async (store, route, forceLoad = false, pageSize) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params)
    const cachedCategory = store.getters['category-next/getCategoryFrom'](route.path)
    const hasCategoryExtras = store.getters['icmaaCategoryExtras/getCategoryExtrasByUrlKey'](route.path)
    const currentCategory = cachedCategory && !forceLoad && hasCategoryExtras ? cachedCategory : await store.dispatch('category-next/loadCategoryWithExtras', { filters })
    if (!store.getters['url/isBackRoute']) {
      await store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory, pageSize })
    }

    catalogHooksExecutors.categoryPageVisited(currentCategory)
  } catch (e) {
    Logger.error('Problem with setting Category initial data!', 'category', e)()
  }
}

export default {
  components: {
    ProductListing
  },
  mixins: [ CategoryMixin, CategoryMetaMixin, ClusterMixin, CategoryGtmMixin ],
  data () {
    return {
      ProductListingTicket
    }
  },
  computed: {
    ...mapGetters({
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal'
    }),
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    const { pageSize } = this.data()
    await composeInitialPageState(store, route, false, route.params.pagesize || pageSize)
    context.output.template = 'amp'
    context.output.appendHead = (context) => {
      return '<script async src="https://cdn.ampproject.org/v0.js"><' + '/script>'
    }
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next() // SSR no need to invoke SW caching here
    else if (!from.name) { // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true
        await composeInitialPageState(vm.$store, to, true, vm.pageSize)
        await vm.$store.dispatch('category-next/cacheProducts', { route: to }) // await here is because we must wait for the hydration
        vm.loading = false
      })
    } else { // Pure CSR, with no initial category state
      next(async vm => {
        vm.loading = true
        vm.$store.dispatch('category-next/cacheProducts', { route: to })
        vm.loading = false
      })
    }
  }
}
</script>

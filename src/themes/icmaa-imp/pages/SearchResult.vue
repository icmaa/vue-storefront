<template>
  <div id="category">
    <header class="t-container">
      <div class="t-flex t-flex-wrap t-px-4 t-mb-8">
        <breadcrumbs class="t-w-full t-my-8" />
        <div class="t-w-full">
          <div class="t-flex t-flex-wrap t-items-center t--mx-1 lg:t--mx-2">
            <h1 class="category-title t-hidden lg:t-block t-w-3/4 t-px-1 lg:t-px-2 t-mb-4 t-font-light t-text-2xl t-text-base-dark">
              <span data-test-id="productsTotal">{{ productsTotal }}</span> {{ $t('Search results for: {term}', { term }) }}
            </h1>
            <div class="t-w-full t-px-1 md:t-px-2 t-flex t-flex-wrap t-items-stretch">
              <button-component style="second" align="center" :icon="activeFilterCount > 0 ? 'check' : 'filter_list'" @click.native="openFilters" class="t-w-full lg:t-w-auto" data-test-id="ButtonFilter">
                {{ $t('Filters') }}
                <span v-if="activeFilterCount > 0" v-text="`(${activeFilterCount})`" class="t-flex-grow t-text-left t-pl-2 t-opacity-75" />
              </button-component>
              <div class="t-w-full md:t-flex-1 t-mt-2 md:t-mt-0 t-overflow-x-auto t-hide-scrollbar t-flex t-items-center">
                <filter-presets class="t-flex t-items-center md:t-ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="t-container">
      <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
        <product-listing :products="getCategoryProducts" :show-add-to-cart="true" />
      </lazy-hydrate>
      <div v-else>
        <product-listing :products="getCategoryProducts" />
      </div>
      <div class="t-flex t-items-center t-justify-center t-mb-8" v-if="moreProductsInSearchResults">
        <button-component type="ghost" @click.native="loadMoreProducts" :disabled="loadingProducts" class="t-w-2/3 lg:t-w-1/4" :class="{ 't-relative t-opacity-60': loadingProducts }">
          {{ $t('Load more') }}
          <loader-background v-if="loadingProducts" bar="t-bg-base-darkest" class="t-bottom-0" />
        </button-component>
      </div>
      <div class="t-mb-8" v-if="isCategoryEmpty">
        <div class="t-bg-white t-mx-4 t-p-4 t-py-10 t-text-center">
          <h4 class="t-text-base t-bold" data-test-id="noProductsInfo">
            {{ $t('No products found!') }}
          </h4>
          <p class="t-text-sm t-text-base-light">
            {{ $t('Please change Your search criteria and try again.') }}
          </p>
        </div>
      </div>
    </div>

    <async-sidebar
      :state-key="'categoryfilter'"
      :async-component="FilterSidebar"
      direction="left"
    />
    <async-sidebar
      :state-key="'addtocart'"
      :async-component="AddToCartSidebar"
      :async-component-props="{ showAddToCartButton: true, closeOnSelect: false }"
      @close="onAddToCartSidebarClose"
    />
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'

import config from 'config'
import { mapGetters, mapMutations } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import * as productMutationTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types'

import AsyncSidebar from 'theme/components/core/blocks/AsyncSidebar/AsyncSidebar.vue'
import FilterPresets from 'theme/components/core/blocks/Category/FilterPresets'
import ProductListing from 'theme/components/core/ProductListing'
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'

const FilterSidebar = () => import(/* webpackChunkName: "vsf-sidebar-categoryfilter" */ 'theme/components/core/blocks/Category/Sidebar')
const AddToCartSidebar = () => import(/* webpackChunkName: "vsf-addtocart-sidebar" */ 'theme/components/core/blocks/AddToCartSidebar/AddToCartSidebar')
const ProductListingTicket = () => import(/* webpackChunkName: "vsf-product-listing-ticket" */ 'theme/components/core/ProductListingTicket')

export default {
  name: 'SearchResult',
  components: {
    AsyncSidebar,
    LazyHydrate,
    ButtonComponent,
    LoaderBackground,
    FilterPresets,
    ProductListing,
    Breadcrumbs
  },
  data () {
    return {
      pageSizes: [24, 48, 60, 100],
      pageSize: this.$route && this.$route.query.pagesize ? this.$route.query.pagesize : 24,
      loadingProducts: false,
      loading: true,
      FilterSidebar,
      AddToCartSidebar,
      ProductListingTicket
    }
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport',
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentFilters: 'category-next/getCurrentFilters',
      getProductsStats: 'category-next/getCategorySearchProductsStats',
      productsTotal: 'category-next/getCategoryProductsTotal',
      contentHeader: 'icmaaCategoryExtras/getContentHeaderByCurrentCategory',
      term: 'icmaaSearchAlias/getCurrentResultsPageTerm',
      termHash: 'icmaaSearchAlias/getCurrentResultsPageTermHash',
      searchAlias: 'icmaaSearchAlias/getCurrentResultsPageAlias'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.productsTotal === 0
    },
    pageSizeOptions () {
      return this.pageSizes.map(s => { return { value: s, label: s } })
    },
    moreProductsInSearchResults () {
      const { perPage, start, total } = this.getProductsStats
      return (start + perPage < total)
    },
    activeFilterCount () {
      return Object.keys(this.getCurrentFilters).length
    }
  },
  methods: {
    ...mapMutations('product', {
      resetCurrentProduct: productMutationTypes.PRODUCT_RESET_CURRENT
    }),
    async changeFilter (filterVariants) {
      if (!Array.isArray(filterVariants)) {
        filterVariants = [filterVariants]
      }

      this.$store.dispatch('category-next/switchSearchFilters', filterVariants)
    },
    openFilters () {
      this.$store.dispatch('ui/setSidebar', { key: 'categoryfilter' })
      IcmaaGoogleTagManagerExecutors.openProductListFilterSidebar()
    },
    onAddToCartSidebarClose () {
      this.resetCurrentProduct({})
    },
    changePageSize (size) {
      this.pageSize = size
      this.$store.dispatch('category-next/switchSearchFilters', [ { type: 'pagesize', id: size } ])
    },
    async loadMoreProducts () {
      if (this.loadingProducts) {
        return
      }

      try {
        this.loadingProducts = true
        await this.$store.dispatch('category-next/loadMoreSearchProducts')
      } catch (e) {
        Logger.error('Problem with fetching more products', 'search', e)()
      } finally {
        this.loadingProducts = false
      }
    },
    async fetchAsyncData (newRoute) {
      try {
        await this.$store.dispatch('icmaaSearchAlias/setCurrentResultAlias', this.term)

        const route = newRoute || this.$route
        const pageSize = route.params.pagesize || this.pageSize
        const category = { id: this.termHash, term: this.searchAlias }

        await this.$store.dispatch('category-next/loadSearchProducts', { route, category, pageSize })
        this.$store.dispatch('category-next/loadSearchBreadcrumbs')

        this.loading = false
      } catch (e) {
        Logger.error('Problem with setting SearchResult initial data!', 'search', e)()
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchAsyncData(to)
      .then(next)
      .catch(next)
  },
  async asyncData ({ context }) {
    if (context) {
      context.output.cacheTags.add(`search`)
    }
  },
  async mounted () {
    await this.fetchAsyncData()
    IcmaaGoogleTagManagerExecutors.searchResultVisited({ term: this.term, products: this.getCategoryProducts })
  },
  serverPrefetch () {
    return this.fetchAsyncData()
  }
}
</script>

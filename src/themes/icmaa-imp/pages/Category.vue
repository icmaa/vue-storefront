<template>
  <div id="category">
    <header class="t-container">
      <div class="t-flex t-flex-wrap t-px-4 t-mb-8">
        <category-extras-header class="t-bg-white t--mx-4 md:t-mx-0 md:t-mt-4 lg:t-w-full" />
        <breadcrumbs :active-route="getCurrentCategory.name" class="t-w-full t-my-4 md:t-my-8" />
        <block-wrapper :components="contentHeader" v-if="contentHeader" />
        <div class="t-w-full">
          <div class="t-flex t-flex-wrap t-items-center t--mx-1 lg:t--mx-2">
            <div class="t-hidden md:t-flex t-items-baseline t-w-full t-px-1 md:t-px-2 t-mb-4">
              <h1 class="category-title t-font-light t-text-2xl t-text-base-dark">
                {{ category.name | htmlDecode }}
              </h1>
              <span class="t-hidden md:t-inline-block t-font-thin t-text-base-light t-text-sm t-leading-7 t-pl-2">
                <span data-test-id="productsTotal">{{ productsTotal }}</span> {{ $t('items') }}
              </span>
            </div>
            <div class="t-w-full t-px-1 md:t-px-2 t-flex t-flex-wrap t-items-stretch">
              <button-component style="second" align="center" :icon="activeFilterCount > 0 ? 'check' : 'filter_list'" @click.native="openFilters" class="t-w-full lg:t-w-auto" data-test-id="ButtonFilter">
                {{ $t('Filters') }}
                <span v-if="activeFilterCount > 0" v-text="`(${activeFilterCount})`" class="t-flex-grow t-text-left t-pl-2 t-opacity-75" />
              </button-component>
              <div class="t-w-full lg:t-flex-1 t-mt-2 lg:t-mt-0 t-overflow-x-auto t-hide-scrollbar t-flex t-items-center">
                <filter-presets class="t-flex t-items-center md:t-ml-2" v-if="shouldLoadPresets" />
                <category-links :categories="filterCategories" class="t-flex t-items-center lg:t-ml-2" v-else />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="t-container">
      <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
        <component v-if="isInTicketWhitelist" :is="ProductListingTicket" :products="getCategoryProducts" />
        <product-listing v-else :products="getCategoryProducts" :show-add-to-cart="true" />
      </lazy-hydrate>
      <div v-else>
        <component v-if="isInTicketWhitelist" :is="ProductListingTicket" :products="getCategoryProducts" />
        <product-listing v-else :products="getCategoryProducts" />
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
      <lazy-hydrate when-idle>
        <category-extras-footer id="category-info-footer" class="t-mb-8" />
      </lazy-hydrate>
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
import { isServer } from '@vue-storefront/core/helpers'
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import * as productMutationTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types'

import AsyncSidebar from 'theme/components/core/blocks/AsyncSidebar/AsyncSidebar.vue'
import ProductListing from 'theme/components/core/ProductListing'
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'
import BlockWrapper from 'icmaa-cms/components/Wrapper'
import CategoryExtrasHeader from 'theme/components/core/blocks/CategoryExtras/Header'
import CategoryExtrasFooter from 'theme/components/core/blocks/CategoryExtras/Footer'

import CategoryMixin from 'icmaa-catalog/components/Category'
import CategoryExtrasMixin from 'icmaa-category-extras/mixins/categoryExtras'
import CategoryMetaMixin from 'icmaa-meta/mixins/categoryMeta'
import ClusterMixin from 'icmaa-user/mixins/cluster'

const CategoryLinks = () => import(/* webpackChunkName: "vsf-category-links" */ 'theme/components/core/blocks/Category/CategoryLinks')
const FilterPresets = () => import(/* webpackChunkName: "vsf-category-filter-presets" */ 'theme/components/core/blocks/Category/FilterPresets')
const FilterSidebar = () => import(/* webpackChunkName: "vsf-sidebar-categoryfilter" */ 'theme/components/core/blocks/Category/Sidebar')
const AddToCartSidebar = () => import(/* webpackChunkName: "vsf-addtocart-sidebar" */ 'theme/components/core/blocks/AddToCartSidebar/AddToCartSidebar')
const ProductListingTicket = () => import(/* webpackChunkName: "vsf-product-listing-ticket" */ 'theme/components/core/ProductListingTicket')

const composeInitialPageState = async (store, route, forceLoad = false, pageSize) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params)
    const cachedCategory = store.getters['category-next/getCategoryFrom'](route.path)
    const hasCategoryExtras = store.getters['icmaaCategoryExtras/getCategoryExtrasByUrlKey'](route.path)
    const currentCategory = cachedCategory && !forceLoad && hasCategoryExtras ? cachedCategory : await store.dispatch('category-next/loadCategoryWithExtras', { filters })

    await Promise.all([
      store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory, pageSize }),
      store.dispatch('category-next/loadChildCategoryFilter')
    ])

    const breadCrumbsLoader = store.dispatch(
      'category-next/loadCategoryBreadcrumbs',
      { category: currentCategory, currentRouteName: currentCategory.name, omitCurrent: true }
    )
    if (isServer) {
      await breadCrumbsLoader
    }
  } catch (e) {
    Logger.error('Problem with setting Category initial data!', 'category', e)()
  }
}

export default {
  name: 'Category',
  components: {
    AsyncSidebar,
    LazyHydrate,
    ButtonComponent,
    LoaderBackground,
    FilterPresets,
    CategoryLinks,
    ProductListing,
    Breadcrumbs,
    CategoryExtrasHeader,
    CategoryExtrasFooter,
    BlockWrapper
  },
  mixins: [ CategoryMixin, CategoryExtrasMixin, CategoryMetaMixin, ClusterMixin ],
  data () {
    return {
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
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getCurrentFilters: 'category-next/getCurrentFilters',
      productsStats: 'category-next/getCategorySearchProductsStats',
      productsTotal: 'category-next/getCategoryProductsTotal',
      filterCategories: 'category-next/getFilterCategories',
      isInTicketWhitelist: 'category-next/isCurrentCategoryInTicketWhitelist',
      contentHeader: 'icmaaCategoryExtras/getContentHeaderByCurrentCategory',
      sidebarNavigationGenderChange: 'ui/getSidebarNavigationGenderChange'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    },
    moreProductsInSearchResults () {
      const { perPage, start, total } = this.productsStats
      return (start + perPage < total)
    },
    activeFilterCount () {
      return Object.keys(this.getCurrentFilters).length
    },
    shouldLoadPresets () {
      return this.filterCategories.length === 0
    }
  },
  watch: {
    async sidebarNavigationGenderChange (newValue) {
      if (newValue === true) {
        this.$store.dispatch('ui/setSidebarNavigationGenderChange', false)

        this.loading = true
        await composeInitialPageState(this.$store, this.$route, false, this.$route.params.pagesize || this.pageSize)
        this.loading = false
      }
    },
    getCurrentCategory (nCategory, oCategory) {
      if (nCategory.id && nCategory.id !== oCategory.id) {
        catalogHooksExecutors.categoryPageVisited(nCategory)
      }
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    const { pageSize } = this.data()
    await composeInitialPageState(store, route, false, route.params.pagesize || pageSize)
  },
  mounted () {
    catalogHooksExecutors.categoryPageVisited(this.getCurrentCategory)
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
  },
  methods: {
    ...mapMutations('product', {
      resetCurrentProduct: productMutationTypes.PRODUCT_RESET_CURRENT
    }),
    openFilters () {
      this.$store.dispatch('ui/setSidebar', { key: 'categoryfilter' })
      IcmaaGoogleTagManagerExecutors.openProductListFilterSidebar()
    },
    onAddToCartSidebarClose () {
      this.resetCurrentProduct({})
    },
    async loadMoreProducts () {
      if (this.loadingProducts) {
        return
      }

      try {
        this.loadingProducts = true
        await this.$store.dispatch('category-next/loadMoreCategoryProducts')
      } catch (e) {
        Logger.error('Problem with fetching more products', 'category', e)()
      } finally {
        this.loadingProducts = false
      }
    }
  }
}
</script>

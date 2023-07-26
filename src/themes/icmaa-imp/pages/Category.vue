<template>
  <div id="category">
    <header class="t-container">
      <div class="t-mb-8 t-flex t-flex-wrap t-px-4">
        <CategoryExtrasHeader class="t--mx-4 t-bg-white md:t-mx-0 md:t-mt-4 lg:t-w-full" />
        <Breadcrumbs
          :active-route="currentRouteName"
          class="t-my-4 t-w-full md:t-my-8"
        />
        <BlockWrapper
          v-if="contentHeader"
          :components="contentHeader"
        />
        <div class="t-w-full">
          <div class="t--mx-1 t-flex t-flex-wrap t-items-center lg:t--mx-2">
            <div class="t-mb-4 t-flex t-w-full t-items-baseline t-px-1 md:t-px-2">
              <h1 class="category-title t-pr-2 t-text-2xl t-font-light t-text-base-dark">
                {{ category.name | htmlDecode }}
              </h1>
              <span class="t-inline-block t-text-sm t-font-extralight t-leading-7 t-text-base-light">
                <span data-test-id="productsTotal">{{ productsTotal }}</span> {{ $t('items') }}
              </span>
            </div>
            <div class="t-flex t-w-full t-flex-wrap t-items-center t-px-1 md:t-px-2">
              <ButtonComponent
                style="second"
                align="center"
                :icon="activeFilterCount > 0 ? 'check' : 'filter_list'"
                class="t-w-full lg:t-w-auto"
                data-test-id="ButtonFilter"
                @click.native="openFilters"
              >
                {{ $t('Filters') }}
                <span
                  v-if="activeFilterCount > 0"
                  class="t-grow t-pl-2 t-text-left t-opacity-75"
                  v-text="`(${activeFilterCount})`"
                />
              </ButtonComponent>
              <div
                v-if="shouldLoadPresets || filterCategories.length > 0"
                class="t-mt-2 t-flex t-h-8 t-w-full t-items-center t-overflow-x-auto t-hide-scrollbar lg:t-mt-0 lg:t-flex-1"
              >
                <FilterPresets
                  v-if="shouldLoadPresets"
                  class="t-flex t-items-center md:t-ml-2"
                />
                <CategoryLinks
                  v-else
                  :categories="filterCategories"
                  class="t-flex t-items-center lg:t-ml-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="t-container">
      <div
        v-if="prevProductsInSearchResults"
        class="t-mb-8 t-flex t-items-center t-justify-center"
      >
        <a
          :href="prevPageUrl"
          class="t-flex t-min-h-10 t-w-2/3 t-items-center t-justify-center t-rounded-sm t-border t-border-base-darkest t-bg-transparent t-px-4 t-text-xs t-uppercase t-text-base-darkest t-webkit-tap-transparent lg:t-w-1/4"
          :class="{ 't-relative t-opacity-60': loadingProducts }"
          @click.prevent="loadMoreProducts(true)"
        >
          {{ $t('Load previous') }}
          <LoaderBackground
            v-if="loadingProducts"
            bar="t-bg-base-darkest"
            class="t-bottom-0"
          />
        </a>
      </div>
      <LazyHydrate
        v-if="isLazyHydrateEnabled"
        :trigger-hydration="!loading"
      >
        <component
          :is="ProductListingTicket"
          v-if="isInTicketWhitelist"
          :products="getCategoryProducts"
        />
        <ProductListing
          v-else
          :products="getCategoryProducts"
          :show-add-to-cart="true"
        />
      </LazyHydrate>
      <div v-else>
        <component
          :is="ProductListingTicket"
          v-if="isInTicketWhitelist"
          :products="getCategoryProducts"
        />
        <ProductListing
          v-else
          :products="getCategoryProducts"
          :show-add-to-cart="true"
        />
      </div>
      <div
        v-if="moreProductsInSearchResults"
        class="t-mb-16 t-flex t-flex-wrap t-items-center t-justify-center"
      >
        <div class="t-mb-4 t-text-sm t-text-base-tone">
          <div class="t-mb-2">
            {{ $t(
              'You\'ve viewed {count} of {total} products',
              { count: visibleProductCount, total: stats.total })
            }}
          </div>
          <div class="t-mx-4 t-flex t-h-1 t-grow t-rounded t-bg-base-lighter">
            <div
              class="t-h-full t-rounded t-bg-base-light"
              :style="{ width: (visibleProductCount * 100 / stats.total) + '%' }"
            />
          </div>
        </div>
        <div class="t-w-full" />
        <a
          :href="nextPageUrl"
          :disabled="loadingProducts"
          class="t-flex t-min-h-10 t-w-2/3 t-items-center t-justify-center t-rounded-sm t-border t-border-base-darkest t-bg-transparent t-px-4 t-text-xs t-uppercase t-text-base-darkest t-webkit-tap-transparent lg:t-w-1/4"
          :class="{ 't-relative t-opacity-60': loadingProducts }"
          @click.prevent="loadMoreProducts()"
        >
          {{ $t('Load more') }}
          <LoaderBackground
            v-if="loadingProducts"
            bar="t-bg-base-darkest"
            class="t-bottom-0"
          />
        </a>
      </div>
      <div
        v-if="isCategoryEmpty"
        class="t-mb-8"
      >
        <div class="t-mx-4 t-bg-white t-p-4 t-py-10 t-text-center">
          <h4
            class="t-bold t-text-base"
            data-test-id="noProductsInfo"
          >
            {{ $t('No products found!') }}
          </h4>
          <p class="t-text-sm t-text-base-light">
            {{ $t('Please change Your search criteria and try again.') }}
          </p>
        </div>
      </div>
      <LazyHydrate when-idle>
        <CategoryExtrasFooter
          id="category-info-footer"
          class="t-mb-8"
        />
      </LazyHydrate>
    </div>

    <AsyncSidebar
      :state-key="'categoryfilter'"
      :async-component="FilterSidebar"
      direction="left"
    />
    <AsyncSidebar
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
import omit from 'lodash-es/omit'
import isEqual from 'lodash-es/isEqual'
import { mapGetters, mapMutations } from 'vuex'
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
      pageSize: this.$route && this.$route.query.pagesize ? this.$route.query.pagesize : 16,
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
      stats: 'category-next/getCategorySearchProductsStats',
      productsTotal: 'category-next/getCategoryProductsTotal',
      filterCategories: 'category-next/getFilterCategories',
      isInTicketWhitelist: 'category-next/isCurrentCategoryInTicketWhitelist',
      contentHeader: 'icmaaCategoryExtras/getContentHeaderByCurrentCategory',
      sidebarNavigationGenderChange: 'ui/getSidebarNavigationGenderChange',
      sessionFilterKeys: 'user/getSessionFilterKeys',
      prevRoute: 'url/getPrevRoute'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    },
    prevProductsInSearchResults () {
      const currentPage = this.$route.query.p || 1
      const { perPage, start, total } = this.stats
      return currentPage > 1 &&
        start + perPage > perPage &&
        this.getCategoryProducts.length < (currentPage * perPage) &&
        this.getCategoryProducts.length < total
    },
    moreProductsInSearchResults () {
      const { perPage, page, total } = this.stats
      return (page * perPage < total)
    },
    visibleProductCount () {
      const { perPage, page, total } = this.stats
      const countProds = page * perPage
      return countProds > total ? total : countProds
    },
    activeFilterCount () {
      return Object.keys(this.getCurrentFilters).length
    },
    nextPageUrl () {
      return this.createPaginationUrl(1)
    },
    prevPageUrl () {
      return this.createPaginationUrl(-1)
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
        await this.composeInitialPageState()
        this.loading = false
      }
    },
    '$route.params.slug': async function (current, old) {
      await this.composeInitialPageState()
      catalogHooksExecutors.categoryPageVisited(this.category)
    },
    '$route.query': async function (current, old) {
      current = omit(current, ['p'])
      old = omit(old, ['p'])
      if (isEqual(current, old)) return

      const pageSize = this.$route?.params?.pagesize || this.pageSize
      const category = this.category

      this.loading = true
      await this.$store.dispatch('category-next/loadCategoryProducts', { category, pageSize })
      this.loading = false
    }
  },
  serverPrefetch () {
    return this.composeInitialPageState()
  },
  async mounted () {
    await this.composeInitialPageState()
    catalogHooksExecutors.categoryPageVisited(this.getCurrentCategory)
  },
  methods: {
    ...mapMutations('product', {
      resetCurrentProduct: productMutationTypes.PRODUCT_RESET_CURRENT
    }),
    async composeInitialPageState () {
      try {
        const pageSize = this.$route?.params?.pagesize || this.pageSize
        const filters = getSearchOptionsFromRouteParams(this.$route.params)
        const cachedCategory = this.$store.getters['category-next/getCategoryFrom'](this.$route.path)
        const hasCategoryExtras = this.$store.getters['icmaaCategoryExtras/getCategoryExtrasByUrlKey'](filters.slug)
        const currentCategory = cachedCategory && hasCategoryExtras
          ? cachedCategory : await this.$store.dispatch('category-next/loadCategoryWithExtras', { filters })

        await Promise.all([
          this.$store.dispatch('category-next/loadCategoryProducts', { category: currentCategory, pageSize }),
          this.$store.dispatch('category-next/loadChildCategoryFilter', { category: currentCategory })
        ])

        await this.$store.dispatch(
          'category-next/loadCategoryBreadcrumbs',
          { category: currentCategory, currentRouteName: currentCategory?.name, omitCurrent: true }
        )
      } catch (e) {
        Logger.error('Problem with setting Category initial data!', 'category', e)()
      }
    },
    openFilters () {
      this.$store.dispatch('ui/setSidebar', { key: 'categoryfilter' })
      IcmaaGoogleTagManagerExecutors.openProductListFilterSidebar()
    },
    onAddToCartSidebarClose () {
      this.resetCurrentProduct({})
    },
    async loadMoreProducts (prev = false) {
      if (this.loadingProducts) {
        return
      }

      try {
        this.loadingProducts = true
        await this.$store.dispatch('category-next/loadMoreCategoryProducts', { router: this.$router, prev })
      } catch (e) {
        Logger.error('Problem with fetching more products', 'category', e)()
      } finally {
        this.loadingProducts = false
      }
    },
    createPaginationUrl (page) {
      const p = this.stats.page + page
      if (p <= 1) {
        return this.$router.resolve({
          query: omit({ ...this.$route?.query }, ['p'])
        })?.href || ''
      }

      return this.$router.resolve({
        query: { ...this.$route?.query, p }
      })?.href || ''
    }
  }
}
</script>

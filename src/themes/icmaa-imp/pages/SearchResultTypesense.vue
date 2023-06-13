<template>
  <div id="category">
    <header class="t-container">
      <div class="t-mb-8 t-flex t-flex-wrap t-px-4">
        <Breadcrumbs class="t-my-8 t-w-full" />
        <div class="t-w-full">
          <div class="t--mx-1 t-flex t-flex-wrap t-items-center lg:t--mx-2">
            <h1 class="category-title t-mb-4 t-hidden t-w-full t-px-1 t-text-2xl t-font-light t-text-base-dark lg:t-block lg:t-px-2">
              <span data-test-id="productsTotal">{{ productsTotal }}</span> {{ $t('Search results for: {term}', { term }) }}
            </h1>
            <div class="t-flex t-w-full t-flex-wrap t-items-stretch t-px-1 md:t-px-2">
              <ButtonComponent
                style="second"
                align="center"
                icon="filter_list"
                class="t-w-full lg:t-w-auto"
                data-test-id="ButtonFilter"
                @click.native="openFilters"
              >
                {{ $t('Filters') }}
              </ButtonComponent>
              <div class="t-mt-2 t-flex t-w-full t-items-center t-overflow-x-auto t-hide-scrollbar md:t-mt-0 md:t-flex-1">
                <FilterPresets class="t-flex t-items-center md:t-ml-2" />
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
        <ButtonComponent
          type="ghost"
          :disabled="loadingProducts"
          class="t-w-2/3 lg:t-w-1/4"
          :class="{ 't-relative t-opacity-60': loadingProducts }"
          @click.native="loadMoreProducts(true)"
        >
          {{ $t('Load previous') }}
          <LoaderBackground
            v-if="loadingProducts"
            bar="t-bg-base-darkest"
            class="t-bottom-0"
          />
        </ButtonComponent>
      </div>
      <LazyHydrate
        v-if="isLazyHydrateEnabled"
        :trigger-hydration="!loading"
      >
        <ProductListing
          :products="products"
          :show-add-to-cart="true"
        />
      </LazyHydrate>
      <div v-else>
        <ProductListing
          :products="products"
          :show-add-to-cart="true"
        />
      </div>
      <div
        v-if="moreProductsInSearchResults"
        class="t-mb-8 t-flex t-items-center t-justify-center"
      >
        <ButtonComponent
          type="ghost"
          :disabled="loadingProducts"
          class="t-w-2/3 lg:t-w-1/4"
          :class="{ 't-relative t-opacity-60': loadingProducts }"
          @click.native="loadMoreProducts()"
        >
          {{ $t('Load more') }}
          <LoaderBackground
            v-if="loadingProducts"
            bar="t-bg-base-darkest"
            class="t-bottom-0"
          />
        </ButtonComponent>
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
    </div>

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
import { mapGetters, mapMutations } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import * as productMutationTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types'
import * as categoryMutationTypes from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'

import AsyncSidebar from 'theme/components/core/blocks/AsyncSidebar/AsyncSidebar.vue'
import FilterPresets from 'theme/components/core/blocks/Category/FilterPresets'
import ProductListing from 'theme/components/core/ProductListing'
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'

const AddToCartSidebar = () => import(/* webpackChunkName: "vsf-addtocart-sidebar" */ 'theme/components/core/blocks/AddToCartSidebar/AddToCartSidebar')

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
  async asyncData ({ context }) {
    if (context) {
      context.output.cacheTags.add(`search`)
    }
  },
  data () {
    return {
      loadingProducts: false,
      loading: true,
      products: [],
      AddToCartSidebar
    }
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      productsStats: 'category-next/getCategorySearchProductsStats',
      productsTotal: 'category-next/getCategoryProductsTotal',
      term: 'icmaaSearch/getCurrentResultsPageTerm',
      prevRoute: 'url/getPrevRouteDispatcher'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.productsTotal === 0
    },
    prevProductsInSearchResults () {
      const currentPage = this.$route.query.p || 1
      const { perPage, start, total } = this.productsStats
      return currentPage > 1 &&
        start + perPage > perPage &&
        this.products.length < (currentPage * perPage) &&
        this.products.length < total
    },
    moreProductsInSearchResults () {
      const { perPage, page, total } = this.productsStats
      return (page * perPage < total)
    }
  },
  watch: {
    '$route': function (a, b) {
      if (a.query?.p !== b.query?.p) return
      this.fetchAsyncData()
    }
  },
  async mounted () {
    await this.fetchAsyncData()
    IcmaaGoogleTagManagerExecutors.searchResultVisited({ term: this.term, products: this.products })
  },
  methods: {
    ...mapMutations('product', {
      resetCurrentProduct: productMutationTypes.PRODUCT_RESET_CURRENT
    }),
    ...mapMutations('category-next', {
      setProductsStats: categoryMutationTypes.CATEGORY_SET_SEARCH_PRODUCTS_STATS
    }),
    onAddToCartSidebarClose () {
      this.resetCurrentProduct({})
    },
    async loadMoreProducts (prev = false) {
      if (this.loadingProducts) {
        return
      }

      try {
        this.loadingProducts = true
        await this.$store.dispatch('category-next/loadMoreSearchProducts', { router: this.$router, prev })
      } catch (e) {
        Logger.error('Problem with fetching more products', 'search', e)()
      } finally {
        this.loadingProducts = false
      }
    },
    async fetchAsyncData (newRoute) {
      try {
        const term = newRoute?.params.term || this.term
        this.$store.dispatch('icmaaSearch/setCurrentTerm', term)

        await this.$store.dispatch('icmaaCmsBlock/single', { value: 'search-settings' })
        await this.$store.dispatch('icmaaSearch/search', { type: 'product', term: this.term })
          .then(response => {
            const { hits, found, page, request_params } = response
            this.products = hits.map(h => h.document)

            this.setProductsStats({
              page,
              perPage: request_params.per_page,
              start: 0,
              visible: this.products.length,
              total: found
            })
          })

        this.$store.dispatch('icmaaSearch/loadSearchBreadcrumbs')

        this.loading = false
      } catch (e) {
        Logger.error('Problem with setting SearchResult initial data!', 'search', e)()
      }
    }
  },
  serverPrefetch () {
    return this.fetchAsyncData()
  },
  metaInfo () {
    return {
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
</script>

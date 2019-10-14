<template>
  <div id="category">
    <header class="t-container">
      <div class="t-flex t-flex-wrap t-px-4 t-mb-8">
        <breadcrumbs :routes="getBreadcrumbs" :active-route="getCurrentCategory.name" class="t-w-full t-my-8" />
        <category-extras-header />
        <div class="t-w-full">
          <div class="t-flex t-flex-wrap t-items-center t--mx-1 lg:t--mx-2">
            <h1 class="category-title t-hidden lg:t-block t-w-3/4 t-px-1 lg:t-px-2 t-mb-4 t-font-light t-text-2xl t-text-base-dark" v-text="title" />
            <div class="t-hidden lg:t-block t-w-1/4 t-px-1 lg:t-px-2 t-text-sm t-text-base-dark t-text-right">
              <span class="t-font-bold">{{ getCategoryProductsTotal }}</span> {{ $t('items') }}
              <span class="t-mx-2 t-text-base-lighter">|</span>
              <dropdown @change="changePageSize" :options="pageSizeOptions" :current="parseInt(pageSize)" position="right" name="pagesize" class="t-inline-block" :dropdown-class="{ 't-w-32 t-mt-2': true }">
                {{ pageSize }} {{ $t('items per page') }}
                <material-icon icon="keyboard_arrow_down" size="xs" class="t-align-middle t-text-primary" />
              </dropdown>
            </div>
            <div class="t-w-1/2 lg:t-w-3/4 t-px-1 lg:t-px-2">
              <button-component style="second" align="stretch" icon="filter_list" @click.native="openFilters" class="t-w-full lg:t-w-auto">
                {{ $t('Filters') }}
              </button-component>
            </div>
            <div class="t-w-1/2 lg:t-w-1/4 t-px-1 lg:t-px-2">
              <sort-by :has-label="true" @change="changeFilter" :value="getCurrentSearchQuery.sort" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="t-container">
      <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
        <product-listing :products="getCategoryProducts" />
      </lazy-hydrate>
      <product-listing v-else :products="getCategoryProducts" />
      <div class="t-flex t-items-center t-justify-center" v-if="moreProductsInSearchResults">
        <button-component type="ghost" @click.native="loadMoreProducts" :disabled="loadingProducts">
          {{ loadingProducts ? $t('Patience please ...') : $t('More products') }}
        </button-component>
      </div>
      <div class="t-bg-white t-mx-4 t-p-4 t-py-10 t-text-center" v-if="isCategoryEmpty">
        <h4 class="t-text-base t-bold" data-testid="noProductsInfo">
          {{ $t('No products found!') }}
        </h4>
        <p class="t-text-sm t-text-base-light">
          {{ $t('Please change Your search criteria and try again.') }}
        </p>
      </div>
    </div>

    <div class="container pb60">
      <div class="row m0 pt15">
        <div class="col-md-3 start-xs mobile-filters" v-show="mobileFilters">
          <div class="close-container absolute w-100">
            <i class="material-icons p15 close cl-accent" @click="closeFilters">close</i>
          </div>
          <sidebar class="mobile-filters-body" :filters="getAvailableFilters" @changeFilter="changeFilter" />
          <div class="relative pb20 pt15">
            <div class="brdr-top-1 brdr-cl-primary absolute divider w-100" />
          </div>
          <button-component @click.native="closeFilters">
            {{ $t('Filter') }}
          </button-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'

import config from 'config'
import rootStore from '@vue-storefront/core/store'
import { mapGetters } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'

import Sidebar from 'theme/components/core/blocks/Category/Sidebar'
import SortBy from 'theme/components/core/blocks/Category/SortBy'
import Dropdown from 'theme/components/core/blocks/Dropdown'
import ProductListing from 'theme/components/core/ProductListing'
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import ButtonComponent from 'theme/components/core/blocks/Button'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

import CategoryMixin from 'icmaa-catalog/components/Category'
import CategoryExtrasHeader from 'theme/components/core/blocks/CategoryExtras/Header'
import CategoryExtrasMixin from 'icmaa-category-extras/mixins/categoryExtras'
import CategoryMetaMixin from 'icmaa-meta/mixins/categoryMeta'

const composeInitialPageState = async (store, route, forceLoad = false, pageSize) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params)
    const cachedCategory = store.getters['category-next/getCategoryFrom'](route.path)
    const currentCategory = cachedCategory && !forceLoad ? cachedCategory : await store.dispatch('category-next/loadCategory', { filters })

    await store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory, pageSize })

    const breadCrumbsLoader = store.dispatch('category-next/loadCategoryBreadcrumbs', currentCategory)
    if (isServer) {
      await breadCrumbsLoader
    }

    catalogHooksExecutors.categoryPageVisited(currentCategory)
  } catch (e) {
    console.error('Problem with setting Category initial data!', e)
  }
}

export default {
  components: {
    LazyHydrate,
    Dropdown,
    ButtonComponent,
    MaterialIcon,
    ProductListing,
    Breadcrumbs,
    Sidebar,
    SortBy,
    CategoryExtrasHeader
  },
  mixins: [ CategoryMixin, CategoryExtrasMixin, CategoryMetaMixin ],
  data () {
    return {
      pageSize: this.$route && this.$route.query.pagesize ? this.$route.query.pagesize : 24,
      mobileFilters: false,
      loadingProducts: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getAvailableFilters: 'category-next/getAvailableFilters',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getProductsStats: 'category-next/getCategorySearchProductsStats'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    },
    getBreadcrumbs () {
      return this.$store.getters['category-next/getBreadcrumbs'].filter(breadcrumb => breadcrumb.name !== this.getCurrentCategory.name)
    },
    pageSizeOptions () {
      return [
        { value: 24, label: 24 },
        { value: 48, label: 48 },
        { value: 60, label: 60 },
        { value: 100, label: 100 }
      ]
    },
    moreProductsInSearchResults () {
      const { perPage, start, total } = this.getProductsStats
      return (start + perPage < total)
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    const { pageSize } = this.data()
    await composeInitialPageState(store, route, false, route.params.pagesize || pageSize)
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
    openFilters () {
      this.mobileFilters = true
    },
    closeFilters () {
      this.mobileFilters = false
    },
    changePageSize (size) {
      this.pageSize = size
      this.$store.dispatch('category-next/switchSearchFilters', [ { type: 'pagesize', id: size } ])
    },
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [filterVariant])
    },
    async loadMoreProducts () {
      if (this.loadingProducts) {
        return
      }

      try {
        this.loadingProducts = true
        await this.$store.dispatch('category-next/loadMoreCategoryProducts')
      } catch (e) {
        console.error('Problem with fetching more products', e)
      } finally {
        this.loadingProducts = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  &__filter {
    min-width: 100px;
  }
}
.divider {
  width: calc(100vw - 8px);
  bottom: 20px;
  left: -36px;
}
.category-filters {
  width: 242px;
}

.mobile-filters {
  overflow: auto;
}

.mobile-filters-button {
  display: none;
}

.mobile-sorting {
  display: none;
}

.sorting {
  label {
    margin-right: 10px;
  }
}

.products-list {
  width: 100%;
  max-width: none;
}

.mobile-filters-button {
  display: block;
  height: 45px;
}

.sorting {
  display: none;
}

.mobile-sorting {
  display: block;
}

.category-filters {
  display: none;
}

.mobile-filters {
  position: fixed;
  background-color: #F2F2F2;
  z-index: 5;
  padding: 0 40px;
  left: 0;
  width: 100vw;
  height: 100vh;
  top: 0;
  box-sizing: border-box;
}

.mobile-filters-body {
  padding-top: 50px;
}

.close-container {
  left: 0;
}

.close {
  margin-left: auto;
}
</style>

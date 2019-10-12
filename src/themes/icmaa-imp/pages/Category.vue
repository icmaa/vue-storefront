<template>
  <div id="category">
    <header class="t-container">
      <div class="t-flex t-flex-wrap t-px-4 t-mb-8">
        <breadcrumbs :routes="getBreadcrumbs" :active-route="getCurrentCategory.name" class="t-w-full t-my-8" />
        <div class="t-w-full">
          <div class="t-flex t-flex-wrap t-items-center t--mx-1 lg:t--mx-2">
            <h1 class="category-title t-hidden lg:t-block t-w-3/4 t-px-1 lg:t-px-2 t-mb-4 t-font-light t-text-2xl t-text-base-dark" v-text="title" />
            <div class="t-hidden lg:t-block t-w-1/4 t-px-1 lg:t-px-2 t-text-sm t-text-base-dark t-text-right">
              <span class="t-font-bold">{{ getCategoryProductsTotal }}</span> {{ $t('items') }}
              <span class="t-mx-2 t-text-base-lighter">|</span>
              <span class="t-cursor-pointer">
                42 {{ $t('items per page') }}
                <material-icon icon="keyboard_arrow_down" size="xs" class="t-align-middle t-text-primary" />
              </span>
            </div>
            <div class="t-w-1/2 lg:t-w-3/4 t-px-1 lg:t-px-2">
              <button-component style="second" align="justify" icon="filter_list" @click.native="openFilters" class="t-w-full lg:t-w-auto">
                {{ $t('Filters') }}
              </button-component>
            </div>
            <div class="t-w-1/2 lg:t-w-1/4 t-px-1 lg:t-px-2">
              <sort-by :has-label="true" @change="changeFilter" :value="getCurrentSearchQuery.sort" />
            </div>
          </div>
        </div>
        <category-extras-header />
      </div>
    </header>

    <div class="t-container">
      <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
        <product-listing :columns="defaultColumn" :products="getCategoryProducts" />
      </lazy-hydrate>
      <product-listing v-else :columns="defaultColumn" :products="getCategoryProducts" />
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
          <button-full
            class="mb20 btn__filter"
            @click.native="closeFilters"
          >
            {{ $t('Filter') }}
          </button-full>
        </div>
        <div class="col-md-9 px10 border-box products-list">
          <p class="col-xs-12 end-md m0 pb20 cl-secondary">
            {{ $t('{count} items', { count: getCategoryProductsTotal }) }}
          </p>
          <div v-if="isCategoryEmpty" class="hidden-xs">
            <h4 data-testid="noProductsInfo">
              {{ $t('No products found!') }}
            </h4>
            <p>{{ $t('Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!') }}</p>
          </div>
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

import Sidebar from '../components/core/blocks/Category/Sidebar'
import ProductListing from '../components/core/ProductListing'
import Breadcrumbs from '../components/core/Breadcrumbs'
import SortBy from '../components/core/SortBy'
import ButtonFull from 'theme/components/theme/ButtonFull'
import ButtonComponent from 'theme/components/core/blocks/Button'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

import onBottomScroll from '@vue-storefront/core/mixins/onBottomScroll'
import CategoryMixin from 'icmaa-catalog/components/Category'
import CategoryExtrasHeader from 'theme/components/core/blocks/CategoryExtras/Header'
import CategoryExtrasMixin from 'icmaa-category-extras/mixins/categoryExtras'
import CategoryMetaMixin from 'icmaa-meta/mixins/categoryMeta'

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params)
    const cachedCategory = store.getters['category-next/getCategoryFrom'](route.path)
    const currentCategory = cachedCategory && !forceLoad ? cachedCategory : await store.dispatch('category-next/loadCategory', { filters })

    await store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory })

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
    ButtonFull,
    ButtonComponent,
    MaterialIcon,
    ProductListing,
    Breadcrumbs,
    Sidebar,
    SortBy,
    CategoryExtrasHeader
  },
  mixins: [ onBottomScroll, CategoryMixin, CategoryExtrasMixin, CategoryMetaMixin ],
  data () {
    return {
      mobileFilters: false,
      defaultColumn: 4,
      loadingProducts: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    },
    getBreadcrumbs () {
      return this.$store.getters['category-next/getBreadcrumbs'].filter(breadcrumb => breadcrumb.name !== this.getCurrentCategory.name)
    }
  },
  async asyncData ({ store, route }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    await composeInitialPageState(store, route)
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next() // SSR no need to invoke SW caching here
    else if (!from.name) { // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true
        await composeInitialPageState(vm.$store, to, true)
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
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [filterVariant])
    },
    columnChange (column) {
      this.defaultColumn = column
    },
    async onBottomScroll () {
      if (this.loadingProducts) return
      this.loadingProducts = true
      try {
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

.product-listing {
  justify-content: center;;
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

<template>
  <sidebar :use-expander-in-title="false" ref="searchSidebar" data-test-id="SearchPanel">
    <template v-slot:top>
      <div class="t-flex t-self-stretch t-items-center t-px-2 t-cursor-pointer" data-test-id="closeButton" @click="closeSidebar">
        <material-icon icon="keyboard_arrow_left" />
      </div>
      <label for="search" class="t-flex t-self-stretch t-items-center">
        <span class="t-sr-only">{{ $t('Algolia-Search') }}</span>
        <material-icon icon="search" size="sm" class="t-text-base-light t-pl-2 t-pr-1" />
      </label>
      <input
        type="text"
        v-model="searchString"
        @input="onInput"
        @blur="$v.searchString.$touch()"
        id="search"
        :placeholder="$t('Type what you are looking for...')"
        autocorrect="off"
        autocomplete="off"
        autofocus="true"
        data-test-id="SearchInput"
        ref="searchString"
        class="t-self-stretch t-flex-expand t-p-0 t-text-lg t-text-base-tone placeholder:t-text-base-lighter"
      >
    </template>
    <template v-slot:top-right>
      <top-button icon="close" text="Close" @click.native="emptySearchInput" v-show="searchString.length > 0" />
    </template>
    <div class="t-pb-20">
      <div v-if="getNoResultsMessage" class="t-px-2 t-mt-2 t-mb-4 t-text-sm">
        {{ getNoResultsMessage }}
      </div>
      <div v-if="emptyResults && pleaseWait" class="t-px-2 t-pt-2 t-pb-4 t-text-sm">
        {{ $t('Please wait') }} ...
      </div>
      <category-panel
        :category-ids="categoryIds"
        title="Categories"
        v-if="!emptyResults && filteredProducts.length && categoryIds.length > 0"
        class="t-pb-4 t-mb-4"
        :class="{ 't-opacity-25': pleaseWait }"
      />
      <div
        v-if="!emptyResults && filteredProducts.length > 0"
        class="product-listing t-flex t-flex-wrap t-bg-base-lightest t--mx-4 t--mt-4 t-px-3 t-py-4"
        :class="{ 't-opacity-25': pleaseWait }"
      >
        <div class="t-flex t-items-center t-justify-center t-w-full t-mx-1">
          <button-component type="second" @click="goToResults()" class="t-w-full md:t-w-2/3 t-mb-4">
            {{ $t('View all results') }}
          </button-component>
        </div>
        <product-tile v-for="product in filteredProducts" :key="product.sku + '-' + (product.parentId || 'parent')" :product="product" @click.native="closeSidebar" class="t-w-1/2 lg:t-w-1/3 t-px-1 t-mb-8" />
      </div>
      <div
        v-if="filteredProducts.length >= size && OnlineOnly"
        class="t-flex t-items-center t-flex-wrap t-justify-center t-mt-4"
        :class="{ 't-opacity-25': pleaseWait }"
      >
        <button-component
          type="ghost"
          v-if="moreProducts"
          @click="loadMore"
          class="t-w-full md:t-w-2/3 t-mb-2"
          :class="{ 't-relative t-opacity-60': loadingProducts }"
          data-test-id="LoadMoreButton"
        >
          {{ $t('Load more') }}
          <loader-background v-if="loadingProducts" bar="t-bg-base-darkest" class="t-bottom-0" />
        </button-component>
        <button-component
          type="second"
          @click="goToResults()"
          class="t-w-full md:t-w-2/3"
          data-test-id="ShowAllButton"
        >
          {{ $t('View all results') }}
        </button-component>
      </div>
    </div>
  </sidebar>
</template>

<script>
import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import ProductTile from 'theme/components/core/ProductTile'
import CategoryPanel from 'theme/components/core/blocks/SearchPanel/CategoryPanel'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import TopButton from 'theme/components/core/blocks/AsyncSidebar/TopButton'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'
import VueOfflineMixin from 'vue-offline/mixin'

import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { searchPanel } from 'config'
import { required, minLength } from 'vuelidate/lib/validators'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import { getCurrentStoreviewDatetime, getCurrentStoreviewDayjsDatetime, toDayjsDate } from 'icmaa-config/helpers/datetime'
import { localizedRoute } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'
import debounce from 'lodash-es/debounce'

import algoliasearch from 'algoliasearch/lite'

export default {
  name: 'SearchPanel',
  components: {
    Sidebar,
    ProductTile,
    CategoryPanel,
    MaterialIcon,
    TopButton,
    ButtonComponent,
    LoaderBackground
  },
  mixins: [VueOfflineMixin],
  validations: {
    searchString: {
      required,
      minLength: minLength(3)
    }
  },
  data () {
    return {
      products: [],
      size: 12,
      start: 0,
      placeholder: i18n.t('Type what you are looking for...'),
      emptyResults: true,
      moreProducts: false,
      loadingProducts: false,
      showPleaseWait: false,
      categoryAggs: [],
      index: null
    }
  },
  watch: {
    searchString (a, b) {
      // Don't search when only a whitespaces is entered
      if (a.trim() === b.trim()) return
      this.search()
    }
  },
  computed: {
    ...mapGetters({
      currentTerm: 'icmaaSearch/getCurrentTerm',
      separateSelectedVariant: 'category-next/separateSelectedVariantInProductList'
    }),
    searchString: {
      get () {
        return this.currentTerm
      },
      set (value) {
        this.$store.dispatch('icmaaSearch/setCurrentTerm', value)
      }
    },
    filteredProducts () {
      return this.products || []
    },
    categoryIds () {
      return this.categoryAggs.map(c => parseInt(c.id))
    },
    getNoResultsMessage () {
      let msg = ''
      if (this.searchString !== '') {
        if (this.$v.searchString.$invalid) {
          msg = i18n.t('Searched term should consist of at least 3 characters.')
        } else if (this.emptyResults && !this.showPleaseWait) {
          msg = i18n.t('No results were found.')
        }
      }

      return msg
    },
    pleaseWait () {
      return this.getNoResultsMessage.length === 0 && this.showPleaseWait
    }
  },
  methods: {
    onInput (e) {
      /**
       * This is a workaround as Android-Chrome won't recognize changes on inputs v-model until space or enter is pressed.
       * It's connected to the used keyboard (Gboard and others) which uses composition (e.g. underlining and autocomplete).
       * It is considered incomplete until you either hit space (indicating ending the word) or explicitly selecting a suggestion.
       * @see https://github.com/vuejs/vue/issues/9777#issuecomment-478831263
       * @see https://forum.vuejs.org/t/v-model-not-working-on-chrome-browser-on-android-device/36364
       */
      if (window && /android/i.test(window.navigator.userAgent)) {
        this.searchString = e.target.value
      }
    },
    search () {
      this.showPleaseWait = (!this.$v.searchString.$invalid)
      this.searchDebounced()
    },
    searchDebounced: debounce(async function () {
      if (!this.$v.searchString.$invalid) {
        this.loadingProducts = true
        this.start = 0

        this.index
          .search(
            this.searchString,
            {
              hitsPerPage: this.size,
              facets: 'category.id'
            }
          )
          .then(response => {
            const { hits, nbHits, nbPages, page, facets } = response
            this.products = hits
            this.emptyResults = hits.length < 1
            this.moreProducts = nbHits > this.size && (page + 1) < nbPages
            this.loadingProducts = false
            this.showPleaseWait = false

            this.categoryAggs = Object.entries(facets['category.id'])
              .map(([id, count]) => ({ count, id }))
              .sort((a, b) => b.count - a.count)

            this.fetchCategories(this.categoryIds)

            this.gtmOnSearchResult()
          })
          .catch(err => {
            this.products = []
            this.loadingProducts = false
            this.showPleaseWait = false
            this.moreProducts = false
            this.emptyResults = true

            Logger.error(err, 'components-search')()
          })
      } else {
        this.products = []
        this.emptyResults = true
      }
    }, 350),
    loadMore () {
      if (!this.moreProducts) return

      this.start += 1

      this.index
        .search(
          this.searchString,
          { hitsPerPage: this.size, page: this.start }
        )
        .then(response => {
          const { hits, nbHits, nbPages, page } = response
          this.products.push(...hits)
          this.loadingProducts = false
          this.showPleaseWait = false
          this.moreProducts = nbHits > this.size && (page + 1) < nbPages
        })
        .catch(err => {
          this.products = []
          this.loadingProducts = false
          this.showPleaseWait = false
          this.moreProducts = false
          this.emptyResults = true

          Logger.error(err, 'components-search')()
        })
    },
    async fetchCategories (categoryIds) {
      const pathFilter = searchPanel.hideCategoriesFromPath.map(c => c.toString())
      const filters = Object.assign({ id: categoryIds, path: { 'nin': pathFilter } })
      return this.$store.dispatch('category-next/loadCategories', { filters })
    },
    emptySearchInput () {
      this.$store.dispatch('icmaaSearch/setCurrentTerm', '')
      Object.assign(this.$data, this.$options.data.apply(this))
      this.$refs.searchString.focus()
    },
    goToResults () {
      this.$router.push(localizedRoute({ name: 'search', params: { term: this.searchString } }))
      this.closeSidebar()
    },
    closeSidebar () {
      this.$store.dispatch('ui/setSidebar', { key: 'searchpanel', status: false })
    },
    gtmOnSearchResult () {
      // Wait and check if the client is still typing to prevent a trigger of `onSearchResult` event
      // and therefore data in GA we can't really relate to because of the sub-searches.
      const currentString = this.searchString
      setTimeout(() => {
        if (currentString !== this.searchString) return
        const term = this.searchString.toLowerCase().trim()
        IcmaaGoogleTagManagerExecutors.onSearchResult({ term, results: this.products })
      }, 2000)
    }
  },
  async mounted () {
    const client = algoliasearch('NJPNX24PMN', '14cd3ece9eae725b0489c31d655335f1')
    this.index = client.initIndex('icmaa-imp-test')

    this.$v.searchString.$touch()

    this.$refs.searchString.focus()
    disableBodyScroll(this.$refs.searchSidebar)

    const lastSearchTime = await localStorage.getItem('shop/user/searchQueryTime') || null
    if (lastSearchTime !== null) {
      const lastSearchDayjsTime = toDayjsDate(lastSearchTime)
      const searchTermTimeLimit = getCurrentStoreviewDayjsDatetime().subtract(30, 'minute')
      if (lastSearchDayjsTime.isBefore(searchTermTimeLimit)) {
        this.emptySearchInput()
        await Promise.all(
          localStorage.removeItem('shop/user/searchQueryTime'),
          localStorage.setItem('shop/user/searchQuery', '')
        )

        return
      }
    }

    this.searchString = await localStorage.getItem('shop/user/searchQuery') || ''
    if (this.searchString) {
      this.search()
    }
  },
  beforeDestroy () {
    const search = this.$v.searchString.$invalid ? '' : this.searchString
    this.$bus.$emit('search-input-change', { search })

    localStorage.setItem('shop/user/searchQuery', search)
    if (search && !this.emptyResults) {
      localStorage.setItem('shop/user/searchQueryTime', getCurrentStoreviewDatetime())
    }

    clearAllBodyScrollLocks()
  }
}
</script>

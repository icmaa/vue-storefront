<template>
  <sidebar :use-expander-in-title="false" ref="searchSidebar" data-test-id="SearchPanel">
    <template v-slot:top>
      <div class="t-flex t-self-stretch t-items-center t-px-2 t-cursor-pointer" data-test-id="closeButton" @click="closeSidebar">
        <material-icon icon="keyboard_arrow_left" />
      </div>
      <label for="search" class="t-flex t-self-stretch t-items-center">
        <span class="t-sr-only">{{ $t('Search') }}</span>
        <material-icon icon="search" size="sm" class="t-text-base-light t-pl-2 t-pr-1" />
      </label>
      <input type="text" v-model="searchString" @input="onInput" @blur="$v.searchString.$touch()" id="search" :placeholder="$t('Type what you are looking for...')" autocorrect="off" autocomplete="off" autofocus="true" data-test-id="SearchInput" ref="searchString" class="t-self-stretch t-flex-expand t-p-0 t-text-lg t-text-base-tone placeholder:t-text-base-lighter">
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
      <category-panel :categories="categories" title="Categories" :link="true" v-if="!emptyResults && filteredProducts.length && categories.length > 0" class="t-mb-4" :class="{ 't-opacity-25': pleaseWait }" />
      <div class="product-listing t-flex t-flex-wrap t-bg-base-lightest t--mx-4 t-px-3 t-py-4" v-if="!emptyResults && filteredProducts.length > 0" :class="{ 't-opacity-25': pleaseWait }">
        <div class="t-flex t-items-center t-justify-center t-w-full t-mx-1">
          <button-component type="second" @click="goToResults()" class="t-w-full md:t-w-2/3 t-mb-4">
            {{ $t('View all results') }}
          </button-component>
        </div>
        <product-tile v-for="product in filteredProducts" :key="product.sku + '-' + (product.parentId || 'parent')" :product="product" @click.native="closeSidebar" class="t-w-1/2 lg:t-w-1/3 t-px-1 t-mb-8" />
      </div>
      <div v-if="filteredProducts.length >= size && OnlineOnly" class="t-flex t-items-center t-flex-wrap t-justify-center t-mt-4" :class="{ 't-opacity-25': pleaseWait }">
        <button-component type="ghost" @click="loadMoreProducts" v-if="moreProducts" class="t-w-full md:t-w-2/3 t-mb-2" :class="{ 't-relative t-opacity-60': loadingProducts }" data-test-id="LoadMoreButton">
          {{ $t('Load more') }}
          <loader-background v-if="loadingProducts" bar="t-bg-base-darkest" class="t-bottom-0" />
        </button-component>
        <button-component type="second" @click="goToResults()" class="t-w-full md:t-w-2/3" data-test-id="ShowAllButton">
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

import config from 'config'
import i18n from '@vue-storefront/i18n'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import { SearchQuery } from 'storefront-query-builder'
import { localizedRoute } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'
import debounce from 'lodash-es/debounce'
import uniq from 'lodash-es/uniq'

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
      searchAlias: '',
      products: [],
      categoryAggs: [],
      size: 12,
      start: 0,
      placeholder: i18n.t('Type what you are looking for...'),
      emptyResults: true,
      moreProducts: true,
      loadingProducts: false,
      showPleaseWait: false
    }
  },
  watch: {
    searchString () {
      this.search()
    }
  },
  computed: {
    ...mapGetters({
      currentTerm: 'icmaaSearchAlias/getCurrentTerm',
      separateSelectedVariant: 'category-next/separateSelectedVariantInProductList'
    }),
    searchString: {
      get () {
        return this.currentTerm
      },
      set (value) {
        this.$store.dispatch('icmaaSearchAlias/setCurrentTerm', value)
      }
    },
    items () {
      return this.$store.state.search
    },
    filteredProducts () {
      return this.products || []
    },
    categories () {
      const splitChars = [' ', '-', ',']
      return this.categoryAggs.filter(category => {
        let searchStrings = []
        const strings = [this.searchString, this.searchAlias]
        strings.forEach(s => splitChars.forEach(c => searchStrings.push(...s.split(c).filter(s => s.length >= 3))))
        searchStrings = uniq(searchStrings)

        const searchRegex = new RegExp(`(${searchStrings.join('|')})`, 'i')

        return searchStrings.length > 0 && searchRegex.test(category.name)
      })
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
        this.searchAlias = await this.getAlias(this.searchString)
        let query = this.prepareQuickSearchQuery(this.searchAlias)

        this.start = 0
        this.moreProducts = true
        this.loadingProducts = true

        /** Enable `separateSelectedVariant` to not overwrite parent variables by selected variant ones. */
        const options = { separateSelectedVariant: this.separateSelectedVariant }

        this.$store.dispatch('product/findProducts', { query, start: this.start, configuration: {}, size: this.size, options }).then(resp => {
          const { items, aggregations } = resp
          this.products = items
          this.start += this.size
          this.emptyResults = items.length < 1
          this.loadingProducts = false
          this.showPleaseWait = false

          this.populateCategoryAggregations(aggregations)

          IcmaaGoogleTagManagerExecutors.onSearchResult({ term: this.searchString, results: this.products })
        }).catch((err) => {
          Logger.error(err, 'components-search')()
        })
      } else {
        this.products = []
        this.emptyResults = true
      }
    }, 350),
    async getAlias (searchString) {
      return this.$store.dispatch('icmaaSearchAlias/getAliasesBySearchString', { searchString })
    },
    async loadMoreProducts () {
      if (!this.$v.searchString.$invalid) {
        let query = this.prepareQuickSearchQuery(await this.getAlias(this.searchString), true)
        this.loadingProducts = true

        /** Enable `separateSelectedVariant` to not overwrite parent variables by selected variant ones. */
        const options = { separateSelectedVariant: this.separateSelectedVariant }

        this.$store.dispatch('product/findProducts', { query, start: this.start, size: this.size, options }).then((resp) => {
          const { items, aggregations, total, start } = resp
          let page = Math.floor(total / this.size)
          let exceeed = total - this.size * page
          if (start === total - exceeed) {
            this.moreProducts = false
          }
          this.products = this.products.concat(items)
          this.start += this.size
          this.emptyResults = this.products.length < 1
          this.loadingProducts = false
        }).catch((err) => {
          this.loadingProducts = false
          Logger.error(err, 'components-search')()
        })
      } else {
        this.products = []
        this.emptyResults = true
      }
    },
    prepareQuickSearchQuery (value, plain = false) {
      let searchQuery = new SearchQuery()

      const searchFilterKey = plain ? 'search-text-plain' : 'search-text'
      searchQuery = searchQuery
        .applyFilter({ key: searchFilterKey, value })

      addDefaultProductFilter(searchQuery, true)

      return searchQuery
    },
    populateCategoryAggregations (aggr) {
      // This is a massive nested aggregation object which we crawl and collect all
      // available categories of all results not just those who are on results page
      this.categoryAggs = []
      if (aggr.categories_found && aggr.categories_found.doc_count > 0) {
        const { categories_found } = aggr
        const categories = categories_found.categories.buckets
        categories.forEach(bucket => {
          // In ES7 the aggregations result isn't wrapped in a extra category object.
          let cat = bucket.hits.hits.hits[0]._source
          if (cat.category) {
            cat = cat.category
          }
          this.categoryAggs.push(cat)
        })
      }
    },
    emptySearchInput () {
      this.$store.dispatch('icmaaSearchAlias/setCurrentTerm', '')
      Object.assign(this.$data, this.$options.data.apply(this))
      this.$refs.searchString.focus()
    },
    goToResults () {
      this.$router.push(localizedRoute({ name: 'search', params: { term: this.searchString } }))
      this.closeSidebar()
    },
    closeSidebar () {
      this.$store.dispatch('ui/setSidebar', { key: 'searchpanel', status: false })
    }
  },
  async mounted () {
    this.$v.searchString.$touch()

    this.$refs.searchString.focus()
    disableBodyScroll(this.$refs.searchSidebar)

    this.searchString = await localStorage.getItem(`shop/user/searchQuery`) || ''
    if (this.searchString) {
      this.search()
    }
  },
  beforeDestroy () {
    const search = this.$v.searchString.$invalid ? '' : this.searchString
    this.$bus.$emit('search-input-change', { search })
    localStorage.setItem(`shop/user/searchQuery`, search)

    clearAllBodyScrollLocks()
  }
}
</script>

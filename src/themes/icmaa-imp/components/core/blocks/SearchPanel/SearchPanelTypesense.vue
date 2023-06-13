<template>
  <Sidebar
    ref="searchSidebar"
    :use-expander-in-title="false"
    data-test-id="SearchPanel"
  >
    <template #top>
      <div
        class="t-flex t-cursor-pointer t-items-center t-self-stretch t-px-2"
        data-test-id="closeButton"
        @click="closeSidebar"
      >
        <MaterialIcon icon="keyboard_arrow_left" />
      </div>
      <label
        for="search"
        class="t-flex t-items-center t-self-stretch"
      >
        <span class="t-sr-only">{{ $t('Search') }}</span>
        <MaterialIcon
          icon="search"
          size="sm"
          class="t-pl-2 t-pr-1 t-text-base-light"
        />
      </label>
      <input
        id="search"
        ref="searchString"
        v-model="searchString"
        type="text"
        :placeholder="$t('Type what you are looking for...')"
        autocorrect="off"
        autocomplete="off"
        autofocus="true"
        data-test-id="SearchInput"
        class="t-flex-expand t-self-stretch t-p-0 t-text-lg t-text-base-tone placeholder:t-text-base-lighter"
        @input="onInput"
        @blur="$v.searchString.$touch()"
      >
    </template>
    <template #top-right>
      <TopButton
        v-show="searchString.length > 0"
        icon="close"
        text="Close"
        @click.native="emptySearchInput"
      />
    </template>
    <div class="t-pb-20">
      <div
        v-if="getNoResultsMessage"
        class="t-mb-8 t-mt-2 t-px-2 t-text-sm"
      >
        {{ getNoResultsMessage }}
      </div>
      <div
        v-if="emptyResults && pleaseWait"
        class="t-px-2 t-pb-8 t-pt-2 t-text-sm"
      >
        {{ $t('Please wait') }} ...
      </div>
      <div
        v-if="categories.length > 0"
        class="categories t-mb-4 t-pb-4"
      >
        <h4 class="t-mb-2 t-text-xs t-uppercase t-text-base-light">
          {{ $t('Categories') }}
        </h4>
        <div class="t--mx-4 t-flex t-overflow-scroll t-px-2 t-hide-scrollbar t-scrolling-touch">
          <ButtonComponent
            v-for="category in categories"
            :key="category.id"
            type="tag"
            size="sm"
            class="t-mx-2 t-flex-fix"
            @click="goToCategory(category)"
          >
            {{ category.name }}
          </ButtonComponent>
        </div>
      </div>
      <div
        v-if="emptyResults && !showPleaseWait && !loadingProducts && history.length > 0"
        class="history t-mb-4 t-pb-4"
      >
        <h4 class="t-mb-3 t-text-xs t-uppercase t-text-base-light">
          {{ $t('Recent searches') }}
        </h4>
        <div
          v-for="(term, i) in history"
          :key="i"
          class="t-mb-3 t-cursor-pointer t-border-b t-px-1 t-pb-3 t-text-sm"
          @click="selectHistoryTerm(term)"
          v-text="term"
        />
      </div>
      <div
        v-if="!emptyResults && products.length > 0"
        class="product-listing t--mx-4 t--mt-4 t-flex t-flex-wrap t-bg-base-lightest t-px-3 t-py-4"
        :class="{ 't-opacity-25': pleaseWait }"
      >
        <div class="t-mx-1 t-flex t-w-full t-items-center t-justify-center">
          <ButtonComponent
            type="second"
            class="t-mb-4 t-w-full md:t-w-2/3"
            @click="goToResults()"
          >
            {{ $t('View all results') }}
          </ButtonComponent>
        </div>
        <ProductTile
          v-for="product in products"
          :key="product.sku + '-' + (product.parentId || 'parent')"
          :product="product"
          class="t-mb-8 t-w-1/2 t-px-1 lg:t-w-1/3"
          @click.native="clickProduct(product)"
        />
      </div>
      <div
        v-if="products.length > 0"
        class="t-mt-4 t-flex t-flex-wrap t-items-center t-justify-center"
        :class="{ 't-opacity-25': pleaseWait }"
      >
        <ButtonComponent
          v-if="moreProducts"
          type="ghost"
          class="t-mb-2 t-w-full md:t-w-2/3"
          :class="{ 't-relative t-opacity-60': loadingProducts }"
          data-test-id="LoadMoreButton"
          @click="loadMore"
        >
          {{ $t('Load more') }}
          <LoaderBackground
            v-if="loadingProducts"
            bar="t-bg-base-darkest"
            class="t-bottom-0"
          />
        </ButtonComponent>
        <ButtonComponent
          type="second"
          class="t-w-full md:t-w-2/3"
          data-test-id="ShowAllButton"
          @click="goToResults()"
        >
          {{ $t('View all results') }}
        </ButtonComponent>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import ProductTile from 'theme/components/core/ProductTile'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import TopButton from 'theme/components/core/blocks/AsyncSidebar/TopButton'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'

import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import { getCurrentStoreviewDatetime, getCurrentStoreviewDayjsDatetime, toDayjsDate } from 'icmaa-config/helpers/datetime'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'
import debounce from 'lodash-es/debounce'
import pick from 'lodash-es/pick'

import { icmaa_search } from 'config'
import { SearchClient } from 'typesense'

const client = new SearchClient(icmaa_search?.typesense?.config || {})
const productIndex = client.collections('product-' + currentStoreView().storeCode)
const categoryIndex = client.collections('category-' + currentStoreView().storeCode)

export default {
  name: 'SearchPanel',
  components: {
    Sidebar,
    ProductTile,
    MaterialIcon,
    TopButton,
    ButtonComponent,
    LoaderBackground
  },
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
      page: 1,
      placeholder: i18n.t('Type what you are looking for...'),
      emptyResults: true,
      moreProducts: false,
      loadingProducts: false,
      showPleaseWait: false,
      categories: [],
      history: [],
      productIndex,
      categoryIndex
    }
  },
  computed: {
    ...mapGetters({
      currentTerm: 'icmaaSearch/getCurrentTerm',
      cleanTerm: 'icmaaSearch/cleanTerm',
      currentCategory: 'category-next/getCurrentCategory',
      getJsonBlockByIdentifier: 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    searchString: {
      get () {
        return this.currentTerm
      },
      set (value) {
        this.$store.dispatch('icmaaSearch/setCurrentTerm', value)
      }
    },
    searchStringWithoutStopWords () {
      return this.cleanTerm(this.searchString)
    },
    getNoResultsMessage () {
      let msg = ''
      if (this.searchString !== '') {
        if (this.$v.searchString.$invalid) {
          msg = i18n.t('Searched term should consist of at least 3 characters.')
        } else if (this.emptyResults && this.categories.length === 0 && !this.showPleaseWait) {
          msg = i18n.t('No products were found.')
        }
      }

      return msg
    },
    pleaseWait () {
      return this.getNoResultsMessage.length === 0 && this.showPleaseWait
    }
  },
  watch: {
    searchStringWithoutStopWords (a, b) {
      // Don't search when only a whitespaces is entered
      if (a.trim() === b.trim()) return
      this.search()
    }
  },
  async mounted () {
    this.$v.searchString.$touch()

    this.$refs.searchString.focus()
    disableBodyScroll(this.$refs.searchSidebar)

    await this.$store.dispatch('icmaaCmsBlock/single', { value: 'search-settings' })

    const lastSearchTime = await localStorage.getItem('shop/user/searchQueryTime') || null
    if (lastSearchTime !== null) {
      const lastSearchDayjsTime = toDayjsDate(lastSearchTime)
      const searchTermTimeLimit = getCurrentStoreviewDayjsDatetime().subtract(30, 'minute')
      if (lastSearchDayjsTime.isBefore(searchTermTimeLimit)) {
        this.emptySearchInput()
        await Promise.all(
          localStorage.removeItem('shop/user/searchQueryTime'),
          localStorage.setItem('shop/user/searchQuery', ''),
          localStorage.setItem('shop/user/searchHistory', '[]')
        )

        return
      }
    }

    this.history = JSON.parse(await localStorage.getItem('shop/user/searchHistory')) || []

    this.searchString = await localStorage.getItem('shop/user/searchQuery') || ''
    if (this.searchString) this.search()
  },
  beforeDestroy () {
    const search = this.$v.searchString.$invalid ? '' : this.searchString
    this.$bus.$emit('search-input-change', { search })

    localStorage.setItem('shop/user/searchQuery', search)
    if (search && !this.emptyResults) {
      localStorage.setItem('shop/user/searchQueryTime', getCurrentStoreviewDatetime())
    }

    clearAllBodyScrollLocks()
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
        this.page = 1

        this.categoryIndex.documents()
          .search({
            q: this.searchStringWithoutStopWords,
            preset: 'category-default',
            per_page: this.size,
            use_cache: true
          })
          .then(response => {
            const { hits } = response
            this.categories = hits.map(h => h.document)
          })
          .catch(() => {
            this.categories = []
          })

        this.productIndex.documents()
          .search({
            q: this.searchStringWithoutStopWords,
            preset: 'product-default',
            per_page: this.size,
            use_cache: true
          })
          .then(response => {
            const { hits, found, page } = response
            this.products = hits.map(h => h.document)
            this.emptyResults = hits.length < 1
            this.moreProducts = found > this.size
            this.loadingProducts = false
            this.showPleaseWait = false

            const currentTerm = this.searchString
            const currentHistory = JSON.stringify(this.history)
            setTimeout(() => {
              if (currentTerm !== this.searchString || currentHistory !== JSON.stringify(this.history)) return
              this.addHistory(currentTerm)
            }, 3000)

            this.gtmOnSearchResult()
          })
          .catch(err => {
            this.products = []
            this.loadingProducts = false
            this.showPleaseWait = false
            this.moreProducts = false
            this.emptyResults = false

            Logger.error(err, 'components-search')()
          })
      } else {
        this.products = []
        this.categories = []
        this.emptyResults = true
      }
    }, 100),
    loadMore () {
      if (!this.moreProducts) return

      this.page += 1

      /** @todo Add pagination */
      this.productIndex.documents()
        .search({
          q: this.searchStringWithoutStopWords,
          preset: 'product-default',
          per_page: this.size,
          page: this.page,
          use_cache: true
        })
        .then(response => {
          const { hits, found, page } = response
          this.products.push(...hits.map(h => h.document))
          this.loadingProducts = false
          this.showPleaseWait = false
          this.moreProducts = found > this.size && (page * this.size) < found
        })
        .catch(err => {
          this.products = []
          this.loadingProducts = false
          this.showPleaseWait = false
          this.moreProducts = false
          this.emptyResults = false

          Logger.error(err, 'components-search')()
        })
    },
    emptySearchInput () {
      Object.assign(
        this.$data,
        this.$options.data.apply(this),
        { history: this.history }
      )

      this.$store.dispatch('icmaaSearch/setCurrentTerm', '')
      this.$refs.searchString.focus()
    },
    clickProduct (product) {
      this.closeSidebar()
      this.addHistory(product.translatedName)
    },
    goToCategory (category) {
      this.addHistory(category.name)

      const gtmCategory = pick(category, ['url_path', 'name', 'id', 'url_key'])
      IcmaaGoogleTagManagerExecutors.onSearchPanelCategoryClick({ category: gtmCategory })

      this.$store.dispatch('ui/closeAll')
      if (category.url_path === this.currentCategory.url_path) return
      this.$router.push(this.localizedRoute(category.url_path))
    },
    goToResults () {
      this.addHistory(this.searchString)

      this.$router.push(localizedRoute({ name: 'search', params: { term: this.searchString } }))
      this.closeSidebar()
    },
    addHistory (term) {
      const items = this.history.filter(t => term.toLowerCase() !== t.toLowerCase())
      items.unshift(term)
      this.history = items.slice(0, 10)

      localStorage.setItem('shop/user/searchHistory', JSON.stringify(this.history))
    },
    selectHistoryTerm (term) {
      this.searchString = term
      this.$refs.searchString.focus()
      this.addHistory(term)
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
  }
}
</script>

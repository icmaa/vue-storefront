<template>
  <sidebar :close-on-click="false" :use-expander-in-title="false" ref="searchSidebar" data-testid="searchSidebar">
    <template v-slot:top>
      <input type="text" v-model="search" @input="makeSearch" @blur="$v.search.$touch()" :placeholder="$t('Type what you are looking for...')" autofocus="true" ref="searchInput" class="t-flex-expand t-mx-2 t-p-0 t-text-lg t-text-base-tone placeholder:t-text-base-lighter">
    </template>
    <div class="t-pb-20">
      <transition name="fade">
        <div v-if="getNoResultsMessage" class="t-px-2 t-mt-2 t-text-sm">
          {{ $t(getNoResultsMessage) }}
        </div>
      </transition>
      <category-panel :categories="categories" v-model="selectedCategoryIds" v-if="!emptyResults && visibleProducts.length && categories.length > 1" class="t-mb-4" />
      <div class="product-listing t-flex t-flex-wrap t-bg-base-lightest t--mx-4 t-px-3 t-py-4" v-if="!emptyResults && visibleProducts.length > 0">
        <product-tile v-for="product in visibleProducts" :key="product.id" :product="product" @click.native="closeSearchpanel" class="t-w-1/2 lg:t-w-1/3 t-px-1 t-mb-8" />
      </div>
      <div
        v-show="OnlineOnly"
        v-if="visibleProducts.length >= 18"
        class="buttons-set align-center py35 mt20 px40"
      >
        <button
          @click="seeMore" v-if="readMore"
          class="no-outline brdr-none py15 px20 bg-cl-mine-shaft :bg-cl-th-secondary cl-white fs-medium-small"
          type="button"
        >
          {{ $t('Load more') }}
        </button>
        <button
          @click="closeSearchpanel"
          class="no-outline brdr-none p15 fs-medium-small close-button"
          type="button"
        >
          {{ $t('Close') }}
        </button>
      </div>
    </div>
  </sidebar>
</template>

<script>
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import SearchPanel from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel'
import ProductTile from 'theme/components/core/ProductTile'
import CategoryPanel from 'theme/components/core/blocks/SearchPanel/CategoryPanel'
import VueOfflineMixin from 'vue-offline/mixin'
import { minLength } from 'vuelidate/lib/validators'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
  components: {
    Sidebar,
    ProductTile,
    CategoryPanel
  },
  mixins: [SearchPanel, VueOfflineMixin],
  validations: {
    search: {
      minLength: minLength(3)
    }
  },
  data () {
    return {
      selectedCategoryIds: []
    }
  },
  computed: {
    visibleProducts () {
      const productList = this.products || []
      if (this.selectedCategoryIds.length) {
        return productList.filter(product => product.category_ids.some(categoryId => {
          const catId = parseInt(categoryId)
          return this.selectedCategoryIds.includes(catId)
        }))
      }
      return productList
    },
    categories () {
      const categoriesMap = {}
      this.products.forEach(product => {
        [...product.category].forEach(category => {
          categoriesMap[category.category_id] = category
        })
      })
      return Object.keys(categoriesMap).map(categoryId => categoriesMap[categoryId])
    },
    getNoResultsMessage () {
      let msg = ''
      if (!this.$v.search.minLength) {
        msg = 'Searched term should consist of at least 3 characters.'
      } else if (this.emptyResults) {
        msg = 'No results were found.'
      }
      return msg
    }
  },
  watch: {
    categories () {
      this.selectedCategoryIds = []
    },
    search (val, org) {
      // Prevent value from being string 'null'
      if (val === null || val === 'null' || val === undefined) {
        this.search = ''
        return
      }

      this.$bus.$emit('search-input-change', { search: val })
    }
  },
  mounted () {
    // add autofocus to search input field
    this.$refs.searchInput.focus()
    disableBodyScroll(this.$refs.searchSidebar)
  },
  destroyed () {
    clearAllBodyScrollLocks()
  }
}
</script>

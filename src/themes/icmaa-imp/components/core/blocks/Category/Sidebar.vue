<template>
  <sidebar :close-on-click="false">
    <template v-slot:top>
      <h2 class="t-self-center t-pl-2 t-text-lg t-text-base-dark">
        {{ $t('Filter') }}
      </h2>
    </template>
    <div>
      <h4 class="sidebar__header relative mt35 mb20 flex">
        <span
          class="weight-400 sidebar__header__clear pointer sans-serif flex lh25"
          @click="resetAllFilters"
          v-show="hasActiveFilters"
        >
          <i class="material-icons cl-accent mr5">
            cancel
          </i>
          {{ $t('Clear filters') }}
        </span>
      </h4>
      <div
        v-for="(filter, filterIndex) in availableFilters"
        :key="filterIndex"
      >
        <h5>
          {{ $t(filterIndex + '_filter') }}
        </h5>

        <div v-if="filterIndex==='color'" class="t-flex t-flex-wrap">
          <color-selector
            context="category"
            code="color"
            v-for="(color, index) in filter"
            :key="index"
            :variant="color"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
        <div v-else-if="filterIndex==='size'">
          <size-selector
            context="category"
            code="size"
            class="size-select mr10 mb10"
            v-for="(size, index) in sortById(filter)"
            :key="index"
            :variant="size"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
        <div v-else-if="filterIndex==='price'">
          <price-selector
            context="category"
            class="price-select mb10 block"
            code="price"
            v-for="(price, index) in filter"
            :key="index"
            :id="price.id"
            :from="price.from"
            :to="price.to"
            :content="price.label"
            :variant="price"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
        <div v-else class="sidebar__inline-selecors">
          <generic-selector
            context="category"
            class="mr10 mb10 block"
            :code="filterIndex"
            v-for="(option, index) in filter"
            :key="index"
            :variant="option"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
      </div>
    </div>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import ColorSelector from 'theme/components/core/ColorSelector'
import SizeSelector from 'theme/components/core/SizeSelector'
import PriceSelector from 'theme/components/core/PriceSelector'
import GenericSelector from 'theme/components/core/GenericSelector'
import pickBy from 'lodash-es/pickBy'

export default {
  components: {
    Sidebar,
    ColorSelector,
    SizeSelector,
    PriceSelector,
    GenericSelector
  },
  computed: {
    ...mapGetters({
      filters: 'category-next/getAvailableFilters',
      getCurrentFilters: 'category-next/getCurrentFilters',
      hasActiveFilters: 'category-next/hasActiveFilters'

    }),
    availableFilters () {
      return pickBy(this.filters, (filter, filterType) => { return (filter.length && !this.$store.getters['category-next/getSystemFilterNames'].includes(filterType)) })
    }
  },
  methods: {
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [ filterVariant ])
    },
    resetAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters')
    },
    sortById (filters) {
      return [...filters].sort((a, b) => { return a.id - b.id })
    }
  }
}
</script>

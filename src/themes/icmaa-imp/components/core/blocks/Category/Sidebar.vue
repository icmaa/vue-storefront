<template>
  <sidebar :close-on-click="false">
    <template v-slot:top>
      <h2 class="t-self-center t-pl-2 t-text-lg t-text-base-dark">
        {{ $t('Filter') }}
      </h2>
    </template>
    <div class="submenu-wrapper" :style="{ transform: `translateX(${translateX}%)` }">
      <h4 @click="resetAllFilters" v-show="hasActiveFilters">
        {{ $t('Clear filters') }}
      </h4>
      <div v-for="(filter, attributeKey) in availableFilters" :key="attributeKey">
        <h5 @click="testSidebar(attributeKey)">
          {{ attributeLabel({ attributeKey }) }}
        </h5>
        <div class="t-flex t-flex-wrap" v-if="attributeKey==='color'">
          <color-selector
            code="color"
            v-for="(color, index) in filter"
            :key="index"
            :variant="color"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
        <div v-else class="sidebar__inline-selecors">
          <generic-selector
            :code="attributeKey"
            v-for="(option, index) in filter"
            :key="index"
            :variant="option"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
      </div>
      <submenu v-for="(item, i) in sidebarPath" :key="i" :index="i" :async-component="getComponent(item.component)" />
    </div>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import Submenu from 'theme/components/theme/blocks/AsyncSidebar/Submenu'
import ColorSelector from 'theme/components/core/blocks/Category/Filter/ColorSelector'
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'
import pickBy from 'lodash-es/pickBy'

const Filter = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-category-filter" */ 'theme/components/core/blocks/Category/Filter')

export default {
  data () {
    return {
      Filter
    }
  },
  components: {
    Sidebar,
    Submenu,
    ColorSelector,
    GenericSelector
  },
  computed: {
    ...mapGetters({
      filters: 'category-next/getAvailableFilters',
      getCurrentFilters: 'category-next/getCurrentFilters',
      hasActiveFilters: 'category-next/hasActiveFilters',
      attributeLabel: 'attribute/getAttributeLabel',
      sidebarPath: 'ui/getSidebarPath'
    }),
    availableFilters () {
      return pickBy(this.filters, (filter, filterType) => { return (filter.length && !this.$store.getters['category-next/getSystemFilterNames'].includes(filterType)) })
    },
    translateX () {
      return this.sidebarPath.length > 0 ? (this.sidebarPath.length) * -100 : 0
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
    },
    getComponent (key) {
      return this[key]
    },
    testSidebar (filterName) {
      this.$store.dispatch('ui/addSidebarPath', { component: 'Filter', test: filterName })
    }
  }
}
</script>

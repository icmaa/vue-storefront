<template>
  <sidebar :close-on-click="false">
    <template v-slot:top>
      <h2 class="t-self-center t-pl-2 t-text-lg t-text-base-dark">
        {{ $t('Filter') }}
      </h2>
    </template>

    <h4 @click="resetAllFilters" v-show="hasActiveFilters">
      {{ $t('Clear filters') }}
    </h4>
    <div v-for="(filter) in availableFilters" :key="filter.attributeKey">
      <h5 @click="openSubmenuFilter(filter)">
        {{ filter.label }}
      </h5>
      <template v-if="!filter.submenu">
        <div class="t-flex t-flex-wrap" v-if="filter.attributeKey === 'color'">
          <color-selector
            v-for="(color, index) in filter.options"
            :code="filter.attributeKey"
            :key="index"
            :variant="color"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
        <div v-else class="sidebar__inline-selecors">
          <generic-selector
            v-for="(option, index) in filter.options"
            :code="filter.attributeKey"
            :key="index"
            :variant="option"
            :selected-filters="getCurrentFilters"
            @change="changeFilter"
          />
        </div>
      </template>
    </div>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import ColorSelector from 'theme/components/core/blocks/Category/Filter/ColorSelector'
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'
import pickBy from 'lodash-es/pickBy'

const Filter = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-category-filter" */ 'theme/components/core/blocks/Category/Filter')

export default {
  components: {
    Sidebar,
    ColorSelector,
    GenericSelector
  },
  computed: {
    ...mapGetters({
      filters: 'category-next/getAvailableFilters',
      getCurrentFilters: 'category-next/getCurrentFilters',
      hasActiveFilters: 'category-next/hasActiveFilters',
      attributeLabel: 'attribute/getAttributeLabel'
    }),
    availableFilters () {
      const submenuFilters = ['size', 'price']
      let filters = Object.entries(this.filters).map(v => { return { attributeKey: v[0], options: v[1] } })
      return filters
        .filter(f => f.options.length && !this.$store.getters['category-next/getSystemFilterNames'].includes(f.attributeKey))
        .map(f => { return { ...f, submenu: submenuFilters.includes(f.attributeKey), label: this.attributeLabel({ attributeKey: f.attributeKey }) } })
    }
  },
  methods: {
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [ filterVariant ])
    },
    resetAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters')
    },
    openSubmenuFilter (filter) {
      if (filter.submenu) {
        this.$store.dispatch('ui/addSidebarPath', { component: Filter, title: filter.label, ...filter })
      }
    }
  }
}
</script>

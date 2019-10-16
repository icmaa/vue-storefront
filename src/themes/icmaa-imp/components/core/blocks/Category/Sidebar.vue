<template>
  <sidebar :title="$t('Filter')" :close-on-click="false">
    <h4 @click="resetAllFilters" v-if="hasActiveFilters" v-text="$t('Clear filters')" />
    <div v-for="(filter) in availableFilters" :key="filter.attributeKey" class="t-w-full t-mb-4">
      <h5 @click="openSubmenuFilter(filter)" v-text="filter.label" />
      <filter-wrapper :attribute-key="filter.attributeKey" :options="filter.options" v-if="!filter.submenu" />
    </div>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import config from 'config'
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import FilterWrapper from 'theme/components/core/blocks/Category/Filter'
import pickBy from 'lodash-es/pickBy'

const AsyncFilter = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-category-filter" */ 'theme/components/core/blocks/Category/Filter')

export default {
  components: {
    Sidebar,
    FilterWrapper
  },
  computed: {
    ...mapGetters({
      filters: 'category-next/getAvailableFilters',
      hasActiveFilters: 'category-next/hasActiveFilters',
      attributeLabel: 'attribute/getAttributeLabel'
    }),
    availableFilters () {
      const submenuFilters = config.products.submenuFilters || []
      let filters = Object.entries(this.filters).map(v => { return { attributeKey: v[0], options: v[1] } })
      return filters
        .filter(f => f.options.length && !this.$store.getters['category-next/getSystemFilterNames'].includes(f.attributeKey))
        .map(f => { return { ...f, submenu: submenuFilters.includes(f.attributeKey), label: this.attributeLabel({ attributeKey: f.attributeKey }) } })
    }
  },
  methods: {
    resetAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters')
    },
    openSubmenuFilter (filter) {
      if (filter.submenu) {
        this.$store.dispatch('ui/addSidebarPath', { component: AsyncFilter, title: filter.label, ...filter })
      }
    }
  }
}
</script>

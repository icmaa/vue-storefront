<template>
  <sidebar :title="$t('Filter')" :close-icon="closeIcon">
    <template v-slot:top-after-title>
      <span class="t-font-thin t-text-base-light t-text-sm t-leading-7 t-pt-1 t-pl-2">
        <span data-test-id="productsTotal">{{ productsTotal }}</span> {{ $t('items') }}
      </span>
      <button-component v-if="hasActiveFilters" type="transparent" size="sm" icon="delete_sweep" :icon-only="true" @click="resetAllFilters">
        {{ $t('Clear filters') }}
      </button-component>
    </template>
    <div class="t-pb-24">
      <button-component icon="arrow_forward" type="select" class="t-w-full t-mb-4" @click="openSortMenu()">
        {{ $t('Sorting') }}
      </button-component>
      <div v-for="(group, groupKey) in groupedFilters" :key="groupKey">
        <div v-if="groupKey === 1" :class="{ 't-border-t t-border-base-lighter t-mt-8 t-pt-6': groupedFilters[0].length > 0 }">
          <h4 class="t-text-sm t-mb-6">
            {{ $t('Productdetails') }}
          </h4>
        </div>
        <div v-for="filter in group" :key="filter.attributeKey" class="t-w-full" :data-attribute-key="filter.attributeKey">
          <template v-if="filter.submenu">
            <button-component icon="arrow_forward" type="select" class="t-w-full" :class="[ groupKey === 0 ? 't-mb-4' : 't-mb-6']" @click="openSubmenuFilter(filter)">
              <span>
                {{ filter.attributeLabel }}
                <span class="t-ml-2 t-text-xs t-text-base-light" v-if="isActiveFilterAttribute(filter.attributeKey)">
                  <material-icon class="t-align-middle" icon="check" size="xs" />
                  {{ currentFilters(filter.attributeKey) }}
                </span>
              </span>
            </button-component>
          </template>
          <template v-else>
            <h5 class="t-flex t-items-center t-text-xs t-text-base-tone t-mb-3">
              {{ filter.attributeLabel }}
              <button-component v-if="isActiveFilterAttribute(filter.attributeKey)" type="transparent" size="sm" icon="delete_sweep" :icon-only="true" @click="unsetFilter(filter.attributeKey)" class="t--my-4">
                {{ $t('Unset {label} filter', { label: filter.attributeLabel }) }}
              </button-component>
            </h5>
            <filter-wrapper :attribute-key="filter.attributeKey" :attribute-label="filter.attributeLabel" :options="filter.options" />
          </template>
        </div>
      </div>
    </div>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import config from 'config'
import i18n from '@vue-storefront/i18n'
import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import FilterWrapper from 'theme/components/core/blocks/Category/Filter'
import ButtonComponent from 'theme/components/core/blocks/Button'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import sortBy from 'lodash-es/sortBy'

const AsyncFilter = () => import(/* webpackChunkName: "vsf-category-filter" */ 'theme/components/core/blocks/Category/Filter')
const AsyncListOptions = () => import(/* webpackChunkName: "vsf-category-list-options" */ 'theme/components/core/blocks/Category/ListOptions')

export default {
  name: 'CategorySidebar',
  components: {
    Sidebar,
    FilterWrapper,
    ButtonComponent,
    MaterialIcon
  },
  computed: {
    ...mapGetters({
      filters: 'category-next/getAvailableFilters',
      hasActiveFilters: 'category-next/hasActiveFilters',
      getCurrentFilters: 'category-next/getCurrentFilters',
      isActiveFilterAttribute: 'category-next/isActiveFilterAttribute',
      getSystemFilterNames: 'category-next/getSystemFilterNames',
      isVisibleFilter: 'category-next/isVisibleFilter',
      attributeLabel: 'attribute/getAttributeLabel',
      attributes: 'attribute/getAttributeListByCode',
      productsTotal: 'category-next/getCategoryProductsTotal'
    }),
    availableFilters () {
      const submenuFilters = config.products.submenuFilters || []
      const singleOptionFilters = config.products.singleOptionFilters || []
      const attributes = this.attributes

      let filters = Object.entries(this.filters)
        .map(v => {
          // Quickfix - There is a bug where an empty option is added for `preorder_searchable`
          const options = v[1].filter(o => o.id !== '0')
          return { attributeKey: v[0], options }
        })
        .filter(f => (f.options.length > 1 || (f.options.length === 1 && singleOptionFilters.includes(f.attributeKey))) && !this.getSystemFilterNames.includes(f.attributeKey) && this.isVisibleFilter(f.attributeKey) && attributes[f.attributeKey])
        .map(f => ({ ...f, submenu: submenuFilters.includes(f.attributeKey), attributeLabel: this.attributeLabel({ attributeKey: f.attributeKey }), position: attributes[f.attributeKey].position || 0 }))
        .map(this.sortOptions)

      if (this.categoryFilter) {
        filters.push(this.categoryFilter)
      }

      return filters
    },
    groupedFilters () {
      let allAvailableFilters = sortBy(this.availableFilters, 'position', 'attributeLabel')
      const parentsOfNestedFilters = Object.keys(config.products.filterTree) || []

      return [
        allAvailableFilters.filter(f => parentsOfNestedFilters.includes(f.attributeKey)),
        allAvailableFilters.filter(f => !parentsOfNestedFilters.includes(f.attributeKey))
      ].map(this.sortOptions)
    },
    categoryFilter () {
      const filter = this.filters.category
      if (!filter || !this.isVisibleFilter('category')) {
        return false
      }

      return {
        attributeLabel: i18n.t('Categories'),
        attributeKey: 'category',
        options: filter,
        submenu: true,
        position: 0
      }
    },
    closeIcon () {
      return this.hasActiveFilters ? 'check' : undefined
    }
  },
  methods: {
    sortOptions (filter) {
      const { options, attributeKey } = filter
      const attribute = this.attributes[attributeKey]
      if (attribute && attribute.options && attribute.options.length > 1) {
        /** Only sort items with `sort_order` prop */
        if (!attribute.options.some(o => o.hasOwnProperty('sort_order'))) {
          return filter
        }

        options.sort((a, b) => {
          const aSort = attribute.options.find(o => o.value === a.id)
          const aSortOrder = aSort && aSort.hasOwnProperty('sort_order') ? aSort.sort_order : 0
          const bSort = attribute.options.find(o => o.value === b.id)
          const bSortOrder = bSort && bSort.hasOwnProperty('sort_order') ? bSort.sort_order : 0
          return aSortOrder - bSortOrder
        })
      }

      return filter
    },
    resetAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters')
      this.$store.dispatch('user/resetSessionDataByCategoryFilter')
    },
    unsetFilter (attributeKey) {
      this.$store.dispatch('category-next/unsetSearchFilterForAttribute', attributeKey)
      this.$store.dispatch('user/removeSessionDataByCategoryFilter', attributeKey)
    },
    currentFilters (attributeKey) {
      let activeFilter = this.getCurrentFilters[attributeKey]
      if (!Array.isArray(activeFilter)) {
        activeFilter = [activeFilter]
      }

      activeFilter = activeFilter.map(f => f.label)
      if (activeFilter.length > 3) {
        activeFilter = activeFilter.slice(0, 3)
        activeFilter.push('...')
      }

      return activeFilter.join(', ')
    },
    openSubmenuFilter (filter) {
      if (filter.submenu) {
        const sidebarProps = { title: filter.attributeLabel, closeIcon: this.closeIcon }
        const sidebar = { component: AsyncFilter, ...sidebarProps, props: filter }
        this.$store.dispatch('ui/addSidebarPath', { sidebar })
      }
    },
    openSortMenu () {
      const sidebarProps = { title: i18n.t('Sorting') }
      const sidebar = { component: AsyncListOptions, ...sidebarProps, props: {} }
      this.$store.dispatch('ui/addSidebarPath', { sidebar })
    }
  },
  watch: {
    closeIcon (closeIcon) {
      this.$store.dispatch('ui/mapSidebarPathItems', sidebar => Object.assign(sidebar, { closeIcon }))
    }
  }
}
</script>

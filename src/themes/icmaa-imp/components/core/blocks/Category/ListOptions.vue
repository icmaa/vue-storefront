<template>
  <div>
    <div class="t-flex t-items-center t-flex-wrap t--mx-2">
      <sort-by
        @change="changeSorting"
        class="t-w-1/2 t-px-2"
      />
      <base-select
        :value="parseInt(pageSize)"
        :options="pageSizeOptions"
        :hide-label="true"
        @change="changePageSize"
        select-class="t-text-sm"
        class="t-w-1/2 t-px-2"
      />
    </div>
  </div>
</template>

<script>

import i18n from '@vue-storefront/i18n'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import SortBy from 'theme/components/core/blocks/Category/SortBy'

export default {
  name: 'ListOptions',
  components: {
    SortBy,
    BaseSelect
  },
  data () {
    return {
      pageSizes: [24, 48, 60, 100],
      pageSize: this.$route && this.$route.query.pagesize ? this.$route.query.pagesize : 24
    }
  },
  computed: {
    pageSizeOptions () {
      return this.pageSizes.map(s => { return { value: s, label: s + ' ' + i18n.t('items per page') } })
    }
  },
  methods: {
    changePageSize (size) {
      this.pageSize = size
      this.$store.dispatch('category-next/switchSearchFilters', [ { type: 'pagesize', id: size } ])
      this.$store.dispatch('ui/closeAll')
    },
    changeSorting (filterVariants) {
      if (!Array.isArray(filterVariants)) {
        filterVariants = [filterVariants]
      }

      this.$store.dispatch('category-next/switchSearchFilters', filterVariants)
      this.$store.dispatch('ui/closeAll')
    }
  }
}
</script>

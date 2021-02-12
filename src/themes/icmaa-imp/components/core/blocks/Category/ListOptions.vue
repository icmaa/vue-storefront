<template>
  <div>
    <div class="t-flex t-items-center t-flex-wrap t--mx-2">
      <sort-by
        @change="changeSorting"
        class="t-w-full t-px-2 t-mb-4"
      />
      <div class="t-w-full t-flex t-items-center t-flex-wrap t-px-4 t-mt-4">
        <label class="t-text-sm t-mr-2">
          {{ $t('Items per page') }}:
        </label>
        <button-component
          v-for="size in pageSizes"
          :key="size"
          type="tag"
          size="sm"
          @click="changePageSize(size)"
          :class="{ 't-opacity-50': parseInt(pageSize) !== size }"
          class="t-ml-1"
        >
          {{ size }}
        </button-component>
      </div>
    </div>
  </div>
</template>

<script>

import ButtonComponent from 'theme/components/core/blocks/Button'
import SortBy from 'theme/components/core/blocks/Category/SortBy'

export default {
  name: 'ListOptions',
  components: {
    SortBy,
    ButtonComponent
  },
  data () {
    return {
      pageSizes: [24, 48, 60, 100],
      pageSize: this.$route && this.$route.query.pagesize ? this.$route.query.pagesize : 24
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

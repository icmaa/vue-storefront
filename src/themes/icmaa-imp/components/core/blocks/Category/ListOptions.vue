<template>
  <div>
    <div class="t--mx-2 t-flex t-flex-wrap t-items-center">
      <div class="t-mb-4 t-flex t-w-full t-flex-wrap t-items-center t-px-4">
        <label class="t-mr-2 t-text-sm">
          {{ $t('Items per page') }}:
        </label>
        <ButtonComponent
          v-for="size in pageSizes"
          :key="size"
          type="tag"
          size="sm"
          padding-x="t-px-2"
          :class="{ 't-opacity-50': parseInt(pageSize) !== size }"
          class="t-ml-1"
          @click="changePageSize(size)"
        >
          {{ size }}
        </ButtonComponent>
      </div>
      <SortBy
        class="t-w-full t-px-2"
        @change="changeSorting"
      />
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
      pageSizes: [16, 24, 48, 60, 100],
      pageSize: this.$route && this.$route.query.pagesize ? this.$route.query.pagesize : 16
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

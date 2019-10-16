<template>
  <div class="filter">
    <generic-selector
      :code="attributeKey"
      v-for="(option, index) in options"
      :key="index"
      :variant="option"
      :selected-filters="getCurrentFilters"
      @change="changeFilter"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'

export default {
  name: 'CategoryFilter',
  components: {
    GenericSelector
  },
  props: {
    attributeKey: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getCurrentFilters: 'category-next/getCurrentFilters'
    })
  },
  methods: {
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [ filterVariant ])
    }
  }
}
</script>

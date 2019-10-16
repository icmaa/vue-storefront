<template>
  <div class="filter">
    <div class="t-flex t-flex-wrap t-mb-4" v-if="attributeKey === 'color'">
      <color-selector
        v-for="(color, index) in options"
        :code="attributeKey"
        :key="index"
        :variant="color"
        :selected-filters="getCurrentFilters"
        @change="changeFilter"
      />
    </div>
    <div class="t-flex t-flex-wrap t-mb-4" v-else>
      <generic-selector
        v-for="(option, index) in options"
        :code="attributeKey"
        :key="index"
        :variant="option"
        :selected-filters="getCurrentFilters"
        @change="changeFilter"
        class="t-mb-2"
        :class="{ 't-mr-2': index !== option.length - 1 }"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorSelector from 'theme/components/core/blocks/Category/Filter/ColorSelector'
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'

export default {
  name: 'CategoryFilter',
  components: {
    ColorSelector,
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

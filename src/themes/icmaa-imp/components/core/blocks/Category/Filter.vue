<template>
  <div class="filter">
    Filter: {{ attributeLabel({ attributeKey }) }}
    <generic-selector
      :code="attributeKey"
      v-for="(option, index) in options"
      :key="index"
      :variant="option"
      :selected-filters="getCurrentFilters"
      @change="changeFilter"
    />
    <button-component icon="keyboard_arrow_left" @click.native="$emit('close')">
      {{ $t('Back') }}
    </button-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    GenericSelector,
    ButtonComponent
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
      getCurrentFilters: 'category-next/getCurrentFilters',
      attributeLabel: 'attribute/getAttributeLabel'
    })
  },
  methods: {
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [ filterVariant ])
    }
  }
}
</script>

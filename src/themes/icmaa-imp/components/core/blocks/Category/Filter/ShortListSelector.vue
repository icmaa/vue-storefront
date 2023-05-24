<template>
  <div>
    <div class="t-flex t-flex-wrap">
      <generic-selector
        v-for="(option, index) in filteredOptions"
        :key="index"
        :option="option"
        class="t-mb-2"
        :class="{ 't-mr-2': index !== option.length - 1 }"
        @change="changeFilter"
      />
      <button-component
        v-if="showMore"
        type="tag"
        size="sm"
        :aria-label="$t(folded ? 'Show more' : 'Show less')"
        class="t-mb-2 t-opacity-50"
        @click="toggleFold"
      >
        {{ folded ? '...' : $t('Show less') }}
      </button-component>
    </div>
  </div>
</template>

<script>
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'ShortListSelector',
  components: {
    GenericSelector,
    ButtonComponent
  },
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      folded: true
    }
  },
  computed: {
    showMore () {
      return this.options.length > 6
    },
    filteredOptions () {
      if (this.showMore && this.folded) {
        return this.options.slice(0, 6)
      }
      return this.options
    }
  },
  methods: {
    changeFilter (option) {
      this.$emit('change', option)
    },
    toggleFold () {
      this.folded = !this.folded
    }
  }
}
</script>

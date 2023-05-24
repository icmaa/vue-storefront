<template>
  <div
    class="t-flex t-w-full t-flex-wrap t-items-stretch"
    data-test-id="SearchInput"
  >
    <label
      class="t-sr-only"
      for="quicksearch"
    >{{ $t('Search') }}</label>
    <input
      id="quicksearch"
      type="text"
      class="t-h-10 t-w-px t-flex-1 t-rounded-none t-border-0 t-border-b t-border-base-light t-pl-3 t-pr-1 t-text-sm t-leading-normal t-text-base-darkest placeholder:t-text-base-light placeholder:t-opacity-100 md:t-w-1/2 md:t-flex-fix lg:t-w-2/5"
      :placeholder="$t('Search')"
      @focus="toggleSearchpanel"
    >
    <div
      class="t-flex t-cursor-pointer t-items-center t-border-b t-border-base-light"
      @click="toggleSearchpanel"
    >
      <material-icon
        icon="search"
        class="t-pr-1"
      />
    </div>
  </div>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'SearchInput',
  components: {
    MaterialIcon
  },
  methods: {
    toggleSearchpanel () {
      this.$store.dispatch('ui/setSidebar', { key: 'searchpanel' })
    }
  }
}
</script>

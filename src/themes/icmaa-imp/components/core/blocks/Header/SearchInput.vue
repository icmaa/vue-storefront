<template>
  <div class="t-flex t-w-full t-flex-wrap t-items-stretch" data-test-id="SearchInput">
    <label class="t-sr-only" for="quicksearch">{{ $t('Search') }}</label>
    <input id="quicksearch" type="text" class="t-flex-1 t-w-px md:t-flex-fix md:t-w-1/2 lg:t-w-2/5 t-leading-normal t-rounded-none t-border-0 t-border-b t-border-base-light t-h-10 t-pl-3 t-pr-1 t-text-sm t-text-base-darkest placeholder:t-opacity-100 placeholder:t-text-base-light" :placeholder="$t('Search')" @focus="toggleSearchpanel">
    <div class="t-flex t-items-center t-border-b t-border-base-light t-cursor-pointer" @click="toggleSearchpanel">
      <material-icon icon="search" class="t-pr-1" />
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

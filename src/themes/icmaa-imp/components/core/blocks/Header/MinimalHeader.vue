<template>
  <div class="header">
    <header class="t-fixed t-w-full t-bg-white is-visible">
      <div class="t-flex">
        <div class="t-container t-pr-4 md:t-px-4 t-flex t-items-center">
          <div class="t-flex t-w-full t-h-full t-flex-wrap t-items-stretch">
            <router-link :to="localizedRoute('/')" class="t-flex t-items-center t-cursor-pointer t-text-base-tone t-bg-base-lightest t-px-3">
              <material-icon icon="keyboard_backspace" class="t-flex t-flex-fix" />
              <span class="t-sr-only">{{ $t('Home Page') }}</span>
            </router-link>
          </div>
          <logo width="174" height="43" class="t-no-underline logo t-flex-fix t--mr-4 xl:t-mr-0" />
        </div>
      </div>
    </header>
    <div class="header-placeholder" />
  </div>
</template>

<script>
import CurrentPage from 'theme/mixins/currentPage'
import Logo from 'theme/components/core/blocks/Header/Logo'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  mixins: [CurrentPage],
  components: {
    Logo,
    MaterialIcon
  }
}
</script>

<style lang="scss" scoped>

header {
  height: 43px;
  top: -55px;
  z-index: 3;
  transition: top 0.2s ease-in-out;
  &.is-visible {
    top: 0;
  }
}

.header-placeholder {
  height: 43px;
}

</style>

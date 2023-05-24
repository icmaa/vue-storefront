<template>
  <div class="header">
    <header class="is-visible t-fixed t-w-full t-bg-white">
      <div class="t-flex">
        <div class="t-container t-flex t-items-center t-pr-4 md:t-px-4">
          <div class="t-flex t-h-full t-w-full t-flex-wrap t-items-stretch">
            <router-link
              :to="localizedHomeRoute"
              class="t-flex t-cursor-pointer t-items-center t-bg-base-lightest t-px-3 t-text-base-tone"
            >
              <material-icon
                icon="keyboard_backspace"
                class="t-flex t-flex-fix"
              />
              <span class="t-sr-only">{{ $t('Home Page') }}</span>
            </router-link>
          </div>
          <logo
            width="174"
            height="43"
            class="logo t--mr-4 t-flex-fix t-no-underline xl:t-mr-0"
          />
        </div>
      </div>
    </header>
    <div class="header-placeholder" />
  </div>
</template>

<script>
import Logo from 'theme/components/core/blocks/Header/Logo'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
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

<template>
  <div
    class="header"
    data-test-id="Header"
  >
    <header
      class="t-fixed t-w-full t-bg-white"
      :class="{ 'is-visible': navVisible }"
    >
      <div class="t-flex t-h-50px t-bg-black">
        <div class="t-container t-flex t-flex-initial t-justify-between t-px-2">
          <ButtonUiSidebar
            icon="dehaze"
            title="Menu"
            ui-state="sidebar"
            data-test-id="HeaderButtonSidebar"
          />
          <div class="t-flex-auto t-border-base-tone sm:t-border-r " />
          <ButtonAccount data-test-id="HeaderButtonAccount" />
          <ButtonUiSidebar
            icon="favorite_border"
            title="Wishlist"
            ui-state="wishlist"
            qty-getter="wishlist/getWishlistItemsCount"
            data-test-id="HeaderButtonWishlist"
          />
          <ButtonCart
            :last="true"
            data-test-id="HeaderButtonCart"
          />
          <LanguageSwitcher />
        </div>
      </div>

      <div class="t-flex t-h-60px">
        <div class="t-container t-flex t-items-center t-px-4">
          <SearchInput />
          <div class="t-w-4 t-flex-expand" />
          <MetaNavigation />
          <Logo
            width="174"
            height="43"
            class="logo t--mr-4 t-flex-fix xl:t-mr-0"
          />
        </div>
      </div>
    </header>
    <div class="header-placeholder" />
  </div>
</template>

<script>
import Logo from 'theme/components/core/blocks/Header/Logo'
import ButtonUiSidebar from 'theme/components/core/blocks/Header/ButtonUiSidebar'
import ButtonCart from 'theme/components/core/blocks/Header/ButtonCart'
import ButtonAccount from 'theme/components/core/blocks/Header/ButtonAccount'
import SearchInput from 'theme/components/core/blocks/Header/SearchInput'
import MetaNavigation from 'theme/components/core/blocks/Header/MetaNavigation'
import LanguageSwitcher from 'theme/components/core/blocks/Header/LanguageSwitcher'

export default {
  name: 'HeaderComponent',
  components: {
    Logo,
    ButtonUiSidebar,
    ButtonCart,
    ButtonAccount,
    SearchInput,
    MetaNavigation,
    LanguageSwitcher
  },
  data () {
    return {
      navVisible: true,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 110
    }
  },
  beforeMount () {
    window.addEventListener(
      'scroll',
      () => {
        this.isScrolling = true
      },
      { passive: true }
    )

    setInterval(() => {
      if (this.isScrolling) {
        this.hasScrolled()
        this.isScrolling = false
      }
    }, 250)
  },
  methods: {
    hasScrolled () {
      this.scrollTop = window.scrollY
      if (
        this.scrollTop > this.lastScrollTop &&
        this.scrollTop > this.navbarHeight
      ) {
        this.navVisible = false
      } else {
        this.navVisible = true
      }
      this.lastScrollTop = this.scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>

header, .header-placeholder {
  height: 110px;
}

header {
  top: -110px;
  z-index: 2;
  transition: top 0.2s ease-in-out;
  &.is-visible {
    top: 0;
  }
}
</style>

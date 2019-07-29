<template>
  <div class="sidebar-menu t-scrolling-touch t-w-full">
    <top>
      <top-button icon="person" text="Account" tabindex="2" class="t-text-base-light" @click.native="login" />
    </top>
    <div
      @click="closeMenu"
      :key="link.id"
      v-for="link in getMainNavigation"
      class=""
    >
      <router-link
        class=""
        :to="localizedRoute(link.route)"
      >
        {{ link.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import Top from 'theme/components/theme/blocks/AsyncSidebar/Top'
import TopButton from 'theme/components/theme/blocks/AsyncSidebar/TopButton'

export default {
  components: {
    Top,
    TopButton
  },
  computed: {
    ...mapState({
      submenu: state => state.ui.submenu,
      currentUser: state => state.user.current
    }),
    ...mapGetters(
      { jsonBlockByIdentifier: 'icmaaCmsBlock/jsonBlockByIdentifier' }
    ),
    getMainNavigation () {
      return this.jsonBlockByIdentifier('navigation-main')
    }
  },
  methods: {
    login () {
      this.closeMenu()
      this.$bus.$emit('modal-toggle', 'modal-signup')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

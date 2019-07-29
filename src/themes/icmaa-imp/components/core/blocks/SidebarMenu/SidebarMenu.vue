<template>
  <div class="sidebar-menu t-scrolling-touch t-w-full">
    <top>
      <top-button icon="person" text="Account" tabindex="2" class="t-text-base-light" @click.native="login" />
    </top>
    <div @click="closeMenu" class="t-p-3 t-pt-4 t-flex t-flex-wrap">
      <navigation-item :link="link" :key="link.id" v-for="link in getMainNavigation" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import Top from 'theme/components/theme/blocks/AsyncSidebar/Top'
import TopButton from 'theme/components/theme/blocks/AsyncSidebar/TopButton'
import NavigationItem from 'theme/components/core/blocks/SidebarMenu/NavigationItem'

export default {
  name: 'SidebarMenu',
  components: {
    Top,
    TopButton,
    NavigationItem
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
      return this.jsonBlockByIdentifier('navigation-main-test')
    }
  },
  methods: {
    closeMenu () {
      this.$store.commit('ui/setSidebar', false)
      this.$store.commit('ui/setMicrocart', false)
    },
    login () {
      this.closeMenu()
      this.$bus.$emit('modal-toggle', 'modal-signup')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

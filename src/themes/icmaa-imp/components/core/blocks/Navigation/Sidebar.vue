<template>
  <sidebar class="t-min-h-screen">
    <template v-slot:top>
      <top-button icon="person" :text="loginButtonText" :tab-index="2" class="t-text-base-light" @click.native="login" />
    </template>
    <template v-slot:default>
      <gender-navigation :items="genderNavigationItems" class="t--mx-4 t--mt-4 t-mb-4" />
      <div class="t-flex t-flex-wrap t--mx-1 t--mb-2">
        <navigation-item v-for="link in mainNavigationItems" v-bind="link" :key="link.id" />
      </div>
    </template>
    <template v-slot:footer>
      <div class="t-flex-expand t-bg-base-lightest t-p-4 t-pb-24" data-test-id="SidebarMenuFooter">
        <div class="t-flex t-w-full t-justify-between">
          <div class="t-flex t-flex-wrap t-items-center" @click="closeMenu">
            <template v-for="(link, index) in metaNavigationItems">
              <router-link
                v-if="link.isRoute === true"
                :key="index"
                :to="localizedRoute(link.route)" :title="link.name | htmlDecode"
                class="t-flex t-flex-fit t-mr-6 t-py-1 t-text-xs t-uppercase t-text-base-tone"
              >
                {{ link.name }}
              </router-link>
              <a
                v-else
                :key="index"
                :href="link.route"
                :title="link.name | htmlDecode"
                class="t-flex t-flex-fit t-mr-6 t-py-1 t-text-xs t-uppercase t-text-base-tone"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ link.name }}
              </a>
            </template>
          </div>
          <div class="t-flex-initial t-h-8 t-ml-4 t-pl-4 t-border-l t-border-base-lighter t-flex t-items-center">
            <flag-icon :iso="languageCode" width="20" height="20" class="t-w-5 t-h-5 t-cursor-pointer" @click.native="showLanguageSwitcher" />
          </div>
        </div>
      </div>
    </template>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'

import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import TopButton from 'theme/components/core/blocks/AsyncSidebar/TopButton'
import GenderNavigation from 'theme/components/core/blocks/Navigation/ClusterNavigation'
import NavigationItem from 'theme/components/core/blocks/Navigation/Item'
import FlagIcon from 'theme/components/core/blocks/FlagIcon'
import FlagMixin from 'theme/mixins/flagMixin'

export default {
  name: 'SidebarMenu',
  mixins: [ FlagMixin ],
  components: {
    Sidebar,
    TopButton,
    GenderNavigation,
    NavigationItem,
    FlagIcon
  },
  data () {
    return {
      loadLanguagesModal: false
    }
  },
  computed: {
    ...mapGetters({
      'currentUser': 'user/getCustomer',
      'getJsonBlockByIdentifier': 'icmaaCmsBlock/getJsonBlockByIdentifier',
      'isLoggedIn': 'user/isLoggedIn'
    }),
    mainNavigation () {
      return this.getJsonBlockByIdentifier('navigation-main')
    },
    metaNavigationItems () {
      return this.getJsonBlockByIdentifier('navigation-meta').map(link =>
        Object.assign(link, { isRoute: (typeof link.route === 'object' || link.route.startsWith('/')) })
      )
    },
    loginButtonText () {
      return this.isLoggedIn ? 'My Account' : 'Login'
    },
    mainNavigationItems () {
      return this.mainNavigation.mainNavigation
    },
    genderNavigationItems () {
      return this.mainNavigation.genderNavigation
    }
  },
  methods: {
    closeMenu () {
      this.$store.dispatch('ui/closeAll')
    },
    login () {
      this.closeMenu()
      if (!this.isLoggedIn) {
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else {
        this.$store.dispatch('ui/setUserSidebar', { active: true })
      }
    },
    showLanguageSwitcher () {
      this.closeMenu()
      this.$bus.$emit('modal-toggle-switcher')
    }
  }
}
</script>

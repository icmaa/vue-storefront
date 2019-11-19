import Vue from 'vue'
import i18n from '@vue-storefront/i18n'

const AsyncUserNavigation = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-user" */ '../components/core/blocks/MyAccount/NavigationSidebar.vue')

export const uiStore = {
  namespaced: true,
  state: {
    viewport: false,
    sidebarPath: [],
    sidebarAnimation: false,
    overlay: false,
    loader: false,
    authElem: 'login',
    checkoutMode: false,
    openMyAccount: false,
    /** Sidebar and popup type states: */
    sidebar: false,
    microcart: false,
    wishlist: false,
    searchpanel: false,
    addtocart: false,
    categoryfilter: false,
    newsletterPopup: false
  },
  mutations: {
    setViewport (state, viewport: string) {
      state.viewport = viewport
    },
    setCloseAll (state) {
      state.microcart = false
      state.sidebar = false
      state.searchpanel = false
      state.wishlist = false
      state.addtocart = false
      state.categoryfilter = false
      state.overlay = false
    },
    setCheckoutMode (state, action) {
      state.checkoutMode = action === true
    },
    toggleSidebar (state, property, action) {
      const status = action || !state[property]
      state.sidebarPath = []
      state[property] = status
      state.overlay = status
    },
    addSidebarPath (state, payload) {
      state.sidebarPath.push(payload)
    },
    removeSidebarPath (state) {
      state.sidebarAnimation = true
      setTimeout(() => {
        state.sidebarAnimation = false
        Vue.delete(state.sidebarPath, state.sidebarPath.length - 1)
      }, 500)
    },
    setOverlay (state, action) {
      state.overlay = action === true
    },
    setLoader (state, action) {
      state.loader = action === true
    },
    setAuthElem (state, action) {
      state.authElem = action
    }
  },
  actions: {
    setViewport ({ commit }, window) {
      /**
       * Breakpoints of TailwindCSS:
       * @see https://tailwindcss.com/docs/breakpoints/#app
       */
      const viewports = [ ['xs', 375], ['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280] ]
      const viewport = viewports.find(vp => window.innerWidth <= vp[1])

      if (viewport) {
        commit('setViewport', viewport[0])
      }
    },
    closeAll ({ commit }) {
      commit('setCloseAll')
    },
    setSidebar ({ commit }, status) {
      commit('toggleSidebar', 'sidebar', status)
    },
    setUserSidebar ({ commit, dispatch, rootGetters }, status) {
      if (!rootGetters['user/isLoggedIn']) {
        return
      }

      commit('toggleSidebar', 'sidebar', status)
      if (status === true) {
        dispatch('addSidebarPath', { component: AsyncUserNavigation, title: i18n.t('My account') })
      }
    },
    setSearchpanel ({ commit }, status) {
      commit('toggleSidebar', 'searchpanel', status)
    },
    setMicrocart ({ commit }, status) {
      commit('toggleSidebar', 'microcart', status)
    },
    setWishlist ({ commit }, status) {
      commit('toggleSidebar', 'wishlist', status)
    },
    setAddtocart ({ commit }, status) {
      commit('toggleSidebar', 'addtocart', status)
    },
    setCategoryfilter ({ commit }, status) {
      commit('toggleSidebar', 'categoryfilter', status)
    },
    addSidebarPath ({ commit }, pathItem) {
      commit('addSidebarPath', pathItem)
    },
    removeLastSidebarPath ({ commit }) {
      commit('removeSidebarPath')
    }
  },
  getters: {
    getViewport: state => state.viewport,
    getSidebarPath: state => state.sidebarPath,
    getSidebarAnimation: state => state.sidebarAnimation
  }
}

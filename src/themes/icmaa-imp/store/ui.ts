import Vue from 'vue'
import i18n from '@vue-storefront/i18n'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'

const AsyncUserNavigation = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-user" */ '../components/core/blocks/MyAccount/NavigationSidebar.vue')

export const uiStore = {
  namespaced: true,
  state: {
    viewport: false,
    sidebarPath: [],
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
      state.sidebarPath = []
    },
    setCheckoutMode (state, action: boolean) {
      state.checkoutMode = action === true
    },
    toggleSidebar (state, property: string, action: boolean) {
      const status = action || !state[property]
      state.sidebarPath = []
      state[property] = status
      state.overlay = status
    },
    addSidebarPath (state, { sidebar, index }) {
      if (index) {
        Vue.set(state.sidebarPath, index, sidebar)
      } else {
        state.sidebarPath.push(sidebar)
      }
    },
    mapSidebarPathItems (state, callback) {
      Vue.set(state, 'sidebarPath', state.sidebarPath.map(callback))
    },
    removeSidebarPath (state) {
      Vue.delete(state.sidebarPath, state.sidebarPath.length - 1)
    },
    setOverlay (state, action: boolean) {
      state.overlay = action === true
    },
    setLoader (state, action: boolean) {
      state.loader = action === true
    },
    setAuthElem (state, action: boolean) {
      state.authElem = action
    }
  },
  actions: {
    setViewport ({ commit }, window: Window) {
      /**
       * Breakpoints of TailwindCSS:
       * @see https://tailwindcss.com/docs/breakpoints/#app
       */
      type viewport = [string, number]
      const viewports: viewport[] = [ ['xs', 375], ['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280] ]
      let viewport: viewport = viewports.find(vp => window.innerWidth <= vp[1])

      /** If no viewport is found because its the largest viewport */
      if (!viewport) {
        viewport = viewports.slice(-1)[0]
      }

      if (viewport) {
        commit('setViewport', viewport[0])
      }
    },
    closeAll ({ commit }) {
      commit('setCloseAll')
      clearAllBodyScrollLocks()
    },
    setSidebar ({ commit }, active: boolean) {
      commit('toggleSidebar', 'sidebar', active)
    },
    setUserSidebar ({ commit, dispatch, rootGetters }, { active }) {
      if (!rootGetters['user/isLoggedIn']) {
        return
      }

      commit('toggleSidebar', 'sidebar', active)
      if (active === true) {
        const sidebar = { component: AsyncUserNavigation, title: i18n.t('My account') }
        dispatch('addSidebarPath', { sidebar })
      }
    },
    setSearchpanel ({ commit }, active: boolean) {
      commit('toggleSidebar', 'searchpanel', active)
    },
    setMicrocart ({ commit }, active: boolean) {
      commit('toggleSidebar', 'microcart', active)
    },
    setWishlist ({ commit }, active: boolean) {
      commit('toggleSidebar', 'wishlist', active)
    },
    setAddtocart ({ commit }, active: boolean) {
      commit('toggleSidebar', 'addtocart', active)
    },
    setCategoryfilter ({ commit }, active: boolean) {
      commit('toggleSidebar', 'categoryfilter', active)
    },
    addSidebarPath ({ commit }, { sidebar, index }) {
      commit('addSidebarPath', { sidebar, index })
    },
    mapSidebarPathItems ({ commit }, callback) {
      commit('mapSidebarPathItems', callback)
    },
    removeLastSidebarPath ({ commit }) {
      commit('removeSidebarPath')
    }
  },
  getters: {
    getViewport: state => state.viewport,
    getSidebarPath: state => state.sidebarPath
  }
}

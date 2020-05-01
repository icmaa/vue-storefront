import Vue from 'vue'
import i18n from '@vue-storefront/i18n'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'

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
    addSidebarPath (state, payload) {
      let sidebars = state.sidebarPath.map(s => Object.assign(s, { visible: false, animation: 'slide-right' }))
      sidebars.push(Object.assign({ appear: true }, payload, { visible: true, animation: 'slide-left' }))
      Vue.set(state, 'sidebarPath', sidebars)
    },
    removeSidebarPath (state) {
      const animationTime = 250
      state.sidebarAnimation = true

      // Make last item invisible
      const lastIndex = state.sidebarPath.length - 1
      const last = Object.assign(state.sidebarPath[lastIndex], { visible: false })
      Vue.set(state.sidebarPath, lastIndex, last)

      // Make item before last item visible
      const previousIndex = lastIndex - 1
      if (previousIndex >= 0) {
        const previous = Object.assign(state.sidebarPath[previousIndex], { visible: true })
        Vue.set(state.sidebarPath, previousIndex, previous)
        setTimeout(() => {
          Vue.set(state.sidebarPath, previousIndex, Object.assign(previous, { animation: 'slide-left' }))
        }, animationTime)
      }

      setTimeout(() => {
        state.sidebarAnimation = false
        Vue.delete(state.sidebarPath, lastIndex)
      }, animationTime)
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
    setUserSidebar ({ commit, dispatch, rootGetters }, { active, appear = true }) {
      if (!rootGetters['user/isLoggedIn']) {
        return
      }

      commit('toggleSidebar', 'sidebar', active)
      if (active === true) {
        dispatch('addSidebarPath', { component: AsyncUserNavigation, title: i18n.t('My account'), appear })
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

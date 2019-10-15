import Vue from 'vue'

export const uiStore = {
  namespaced: true,
  state: {
    viewport: false,
    sidebar: false,
    sidebarPath: [],
    microcart: false,
    wishlist: false,
    searchpanel: false,
    addtocart: false,
    categoryfilter: false,
    newsletterPopup: false,
    overlay: false,
    loader: false,
    authElem: 'login',
    checkoutMode: false,
    openMyAccount: false,
    submenu: {
      depth: false,
      path: []
    }
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
      state.sidebarPath = []
      state[property] = action || !state[property]
      state.overlay = action || !state[property]
    },
    addSidebarPath (state, payload) {
      state.sidebarPath.push(payload)
    },
    removeSidebarPath (state) {
      Vue.delete(state.sidebarPath, state.sidebarPath.length - 1)
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
      const viewports = [ ['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280] ]
      const viewport = viewports.find(vp => window.innerWidth <= vp[1])

      if (viewport) {
        commit('setViewport', viewport[0])
      }
    },
    closeAll ({ commit }) {
      commit('setCloseAll')
    },
    setSidebar ({ commit, state }, status) {
      commit('toggleSidebar', 'sidebar', status)
    },
    setMicrocart ({ commit, state }, status) {
      commit('toggleSidebar', 'microcart', status)
    },
    setWishlist ({ commit, state }, status) {
      commit('toggleSidebar', 'wishlist', status)
    },
    setAddtocart ({ commit, state }, status) {
      commit('toggleSidebar', 'addtocart', status)
    },
    setCategoryfilter ({ commit, state }, status) {
      commit('toggleSidebar', 'categoryfilter', status)
    },
    addSidebarPath ({ commit }, pathItem) {
      commit('addSidebarPath', pathItem)
    },
    removeSidebarPath ({ commit }) {
      commit('removeSidebarPath')
    }
  },
  getters: {
    getViewport: state => state.viewport,
    getSidebarPath: state => state.sidebarPath
  }
}

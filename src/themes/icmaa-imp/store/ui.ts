export const uiStore = {
  namespaced: true,
  state: {
    viewport: false,
    sidebar: false,
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
    setMicrocart (state, action) {
      state.microcart = action === true
      state.overlay = action === true
    },
    setSidebar (state, action) {
      state.sidebar = action === true
      state.overlay = action === true
    },
    setSearchpanel (state, action) {
      state.searchpanel = action === true
      state.overlay = action === true
    },
    setWishlist (state, action) {
      state.wishlist = action === true
      state.overlay = action === true
    },
    setAddtocart (state, action) {
      state.addtocart = action === true
      state.overlay = action === true
    },
    setCategoryfilter (state, action) {
      state.categoryfilter = action === true
      state.overlay = action === true
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
    toggleMicrocart ({ commit, state }) {
      commit('setMicrocart', !state.microcart)
    },
    toggleWishlist ({ commit, state }) {
      commit('setWishlist', !state.wishlist)
    },
    toggleAddtocart ({ commit, state }) {
      commit('setAddtocart', !state.addtocart)
    },
    toggleCategoryfilter ({ commit, state }) {
      commit('setCategoryfilter', !state.categoryfilter)
    }
  },
  getters: {
    getViewport: state => state.viewport
  }
}

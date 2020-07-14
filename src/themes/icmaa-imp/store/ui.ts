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
    newsletterPopup: false,
    modals: {}
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
    },
    setModal (state, item: { name: string, visible: boolean, priority?: number }) {
      let { name, priority, visible } = item
      if (!priority) {
        priority = (state.modals[name] && state.modals[name].priority)
          ? state.modals[name].priority
          : Object.keys(state.modals).length * 10 + 10
      }

      Vue.set(state.modals, item.name, { visible, priority })
    },
    setModalPriority (state, { name, priority }) {
      const modal = Object.assign({}, state.modals[name], { priority })
      Vue.set(state.modals, name, modal)
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
    },
    toggleModal ({ commit, getters }, item: { name: string, visible?: boolean }) {
      if (item.visible === undefined) {
        item.visible = !getters.isModalVisible(item.name)
      }

      if (item.visible === true) {
        commit('setOverlay', item.visible)
      } else if (item.visible === false && getters.getVisibleModals.length <= 1) {
        setTimeout(() => commit('setOverlay', false), 300)
      }

      commit('setModal', item)
    },
    showModal ({ dispatch }, name: string) {
      dispatch('toggleModal', { name, visible: true })
    },
    hideModal ({ dispatch }, name: string) {
      dispatch('toggleModal', { name, visible: false })
    },
    setModalPriority ({ commit }, { name, priority }) {
      commit('setModalPriority', { name, priority })
    }
  },
  getters: {
    getViewport: state => state.viewport,
    getSidebarPath: state => state.sidebarPath,
    getVisibleModals: state => {
      return Object.entries(state.modals)
        .map((m: any) => ({ ...m[1], name: m[0] }))
        .filter(m => m.visible === true)
    },
    getHighestVisibleModal: (state, getters) => {
      return getters.getVisibleModals.reduce((prev, next) => prev && prev.priority < next.priority ? next : prev)
    },
    isModalVisible: (state, getters) => name => {
      if (
        getters.getVisibleModals.find(m => m.name === name) &&
        getters.getHighestVisibleModal &&
        getters.getHighestVisibleModal.name === name
      ) {
        return state.modals[name].visible
      }

      return false
    }
  }
}

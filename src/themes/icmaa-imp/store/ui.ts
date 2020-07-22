import Vue from 'vue'
import i18n from '@vue-storefront/i18n'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'

const AsyncUserNavigation = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-user" */ '../components/core/blocks/MyAccount/NavigationSidebar.vue')

export const uiStore = {
  namespaced: true,
  state: {
    viewport: false,
    loader: false,
    authElem: 'login',
    /** Sidebar and modal type states: */
    modals: {},
    sidebars: {},
    sidebarPath: [],
    overlay: false
  },
  mutations: {
    setViewport (state, viewport: string) {
      state.viewport = viewport
    },
    setCloseAll (state) {
      Object.keys(state.sidebars).forEach(k => {
        if (state.sidebars[k] && state.sidebars[k] === true) {
          Vue.set(state.sidebars, k, false)
        }
      })
      state.overlay = false
      state.sidebarPath = []
    },
    toggleSidebar (state, key: string, action: boolean) {
      if (!state.sidebars.hasOwnProperty(key)) {
        Vue.set(state.sidebars, key, false)
      }

      const status = action || !state.sidebars[key]
      Vue.set(state.sidebars, key, status)
      state.sidebarPath = []
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
    setSidebar ({ commit }, { key, status }) {
      commit('toggleSidebar', key, status)
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
        clearAllBodyScrollLocks()
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
    getSidebarStatus: (state) => (key: string) => state.sidebars.hasOwnProperty(key) ? state.sidebars[key] : false,
    getVisibleModals: state => {
      return Object.entries(state.modals)
        .map((m: any) => ({ ...m[1], name: m[0] }))
        .filter(m => m.visible === true)
    },
    getHighestVisibleModal: (state, getters) => {
      return getters.getVisibleModals.length > 0
        ? getters.getVisibleModals.reduce((prev, next) => prev && prev.priority < next.priority ? next : prev) : false
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

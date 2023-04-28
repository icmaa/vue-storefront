import Vue from 'vue'
import i18n from '@vue-storefront/i18n'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'
import type { Route } from 'vue-router'

const AsyncUserNavigation = () => import(/* webpackChunkName: "vsf-sidebar-user" */ '../components/core/blocks/MyAccount/NavigationSidebar.vue')

export const uiStore = {
  namespaced: true,
  state: {
    viewport: false,
    isTouchDevice: false,
    loader: {
      active: false,
      message: false
    },
    authElem: 'login',
    authRedirect: false,
    /** Sidebar and modal type states: */
    modals: {},
    modalInitTimeout: true,
    sidebars: {},
    sidebarPath: [],
    overlay: false,
    sidebarNavigationGenderChange: false
  },
  mutations: {
    setViewport (state, viewport: string) {
      state.viewport = viewport
    },
    setIsTouchDevice (state, status: boolean) {
      state.isTouchDevice = status
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
    toggleSidebar (state, { key, action }) {
      if (!state.sidebars.hasOwnProperty(key)) {
        Vue.set(state.sidebars, key, false)
      }

      const status = action !== undefined ? action : !state.sidebars[key]
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
    setLoader (state, { active = true, message }: { active: boolean, message?: string | boolean }) {
      message = active === false ? false : message || false
      state.loader = { active, message }
    },
    setAuthElem (state, action: boolean) {
      state.authElem = action
    },
    setAuthRedirect (state, route?: Route) {
      state.authRedirect = route || false
    },
    setModal (state, item: { name: string, visible: boolean, priority?: number, delayed?: boolean, queued?: boolean }) {
      let { name, priority, visible, delayed, queued } = item
      if (!priority) {
        priority = state.modals[name]?.priority
          ? state.modals[name].priority
          : Object.keys(state.modals).length * 10 + 10
      }

      if (!delayed) delayed = state.modals[name]?.delayed || false
      if (!queued) queued = state.modals[name]?.queued || false

      Vue.set(state.modals, item.name, { visible, priority, delayed, queued })
    },
    setModalPriority (state, { name, priority }) {
      const modal = Object.assign({}, state.modals[name], { priority })
      Vue.set(state.modals, name, modal)
    },
    setModalDelay (state, { name, delayed }) {
      const modal = Object.assign({}, state.modals[name], { delayed })
      Vue.set(state.modals, name, modal)
    },
    setModalInitialTimeout (state, value = false) {
      state.modalInitTimeout = value
    },
    setSidebarNavigationGenderChange (state, value) {
      state.sidebarNavigationGenderChange = value
    }
  },
  actions: {
    setViewport ({ commit }, window: Window) {
      /**
       * Breakpoints of TailwindCSS:
       * @see https://tailwindcss.com/docs/breakpoints/#app
       */
      type viewport = [string, number]
      const viewports: viewport[] = [ ['xl', 1280], ['lg', 1024], ['md', 768], ['sm', 640], ['xs', 375] ]
      let viewport: viewport = viewports.find(vp => window.matchMedia(`(min-width: ${vp[1]}px)`).matches)

      /** If no viewport is found because its the smallest viewport */
      if (!viewport) {
        viewport = viewports.slice(-1)[0]
      }

      if (viewport) {
        commit('setViewport', viewport[0])
      }
    },
    setIsTouchDevice ({ commit }, { window, navigator }: { window: Window, navigator: Navigator }) {
      const isTouchDevice = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      commit('setIsTouchDevice', isTouchDevice)
    },
    closeAll ({ commit }) {
      commit('setCloseAll')
      clearAllBodyScrollLocks()
    },
    loader ({ commit }, payload) {
      if (typeof payload === 'boolean') {
        payload = { active: payload }
      }

      commit('setLoader', payload)
    },
    setSidebar ({ commit }, { key, status }) {
      commit('toggleSidebar', { key, action: status })
    },
    setUserSidebar ({ commit, dispatch, rootGetters }, { active }) {
      if (!rootGetters['user/isLoggedIn']) {
        return
      }

      commit('toggleSidebar', { key: 'sidebar', action: active })
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
    setSidebarNavigationGenderChange ({ commit }, value) {
      commit('setSidebarNavigationGenderChange', value)
    },
    toggleModal ({ commit, getters, state }, item: { name: string, visible?: boolean, delayed?: boolean, queued?: boolean }) {
      item = Object.assign({}, state.modals[item.name], item)
      if (state.modalInitTimeout === true && item.delayed === true) {
        item.queued = true
        item.visible = false
      }

      if (item.visible === undefined) {
        item.visible = !getters.isModalVisible(item.name)
      }

      if (item.visible === true) {
        item.queued = false
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
    showModalImmediately ({ dispatch }, name: string) {
      dispatch('toggleModal', { name, visible: true, delayed: false })
    },
    hideModal ({ dispatch }, name: string) {
      dispatch('toggleModal', { name, visible: false })
    },
    setModalPriority ({ commit }, { name, priority }) {
      commit('setModalPriority', { name, priority })
    },
    setModalDelay ({ commit }, { name, delayed = true }) {
      commit('setModalDelay', { name, delayed })
    },
    initModalDelay ({ state, dispatch, commit }) {
      setTimeout(() => {
        commit('setModalInitialTimeout')
        dispatch('loadDelayedModals')
      }, 5000)
    },
    loadDelayedModals ({ state, dispatch, commit }) {
      Object.keys(state.modals)
        .map(name => ({ name, ...state.modals[name] }))
        .filter(modal => modal.queued === true)
        .forEach(modal => {
          dispatch('showModal', modal.name)
        })
    }
  },
  getters: {
    getViewport: state => state.viewport,
    isTouchDevice: state => state.isTouchDevice,
    getAuthRedirect: (state) => state.authRedirect,
    getSidebarPath: state => state.sidebarPath,
    getSidebarStatus: (state) => (key: string) => state.sidebars.hasOwnProperty(key) ? state.sidebars[key] : false,
    getSidebarNavigationGenderChange: (state): boolean => state.sidebarNavigationGenderChange,
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

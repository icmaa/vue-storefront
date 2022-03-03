import Vue from 'vue'
import { isServer } from '@vue-storefront/core/helpers'

export const routerHelper = Vue.observable({
  popStateDetected: false
})

export const initBrowserBackEvent = () => {
  !isServer && window.addEventListener('popstate', () => {
    routerHelper.popStateDetected = true
  })
}

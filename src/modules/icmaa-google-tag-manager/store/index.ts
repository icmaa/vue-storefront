import { Module } from 'vuex'
import GoogleTagManagerState from '../types/GoogleTagManagerState'

export const icmaaGoogleTagManagerModule: Module<GoogleTagManagerState, any> = {
  namespaced: true,
  state: {
    key: null
  }
}

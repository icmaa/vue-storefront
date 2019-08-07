import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import SpotifyState from '../types/SpotifyState'

const mutations: MutationTree<SpotifyState> = {
  [types.ICMAA_SPOTIFY_RELATEDARTIST_ADD] (state, payload) {
    const item = state.relatedArtists.find(item => item.categoryId === payload.parent.id)
    if (!item) {
      state.relatedArtists.push(payload)
    }
  }
}

export default mutations

import { GetterTree } from 'vuex'
import SpotifyState from '../types/SpotifyState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<SpotifyState, RootState> = {
  relatedArtist: (state) => state.relatedArtists,
  relatedArtistByCategoryId: (state) => (id: number): string[] => state.relatedArtists[id]
}

export default getters

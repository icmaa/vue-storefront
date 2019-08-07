import { GetterTree } from 'vuex'
import SpotifyState, { RelatedArtistsStateListItem } from '../types/SpotifyState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<SpotifyState, RootState> = {
  relatedArtist: (state) => state.relatedArtists,
  relatedArtistByCategoryId: (state) => (id: number): RelatedArtistsStateListItem => {
    return state.relatedArtists.find(cat => cat.categoryId === id)
  }
}

export default getters

import { GetterTree } from 'vuex'
import SpotifyState from '../types/SpotifyState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category';
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<SpotifyState, RootState> = {
  relatedArtist: (state) => state.relatedArtists,
  relatedArtistsByCategoryId: (state) => (id: number): string[] => state.relatedArtists[id],
  relatedArtistsCategoriesByCategoryId: (state, getters, rootState, rootGetters) => (id: number): Category[] => {
    return getters.relatedArtistsByCategoryId(id)
      .map(name => rootGetters['icmaaCmsCategoryExtras/categoryBy']('name', name))
      .filter(c => c && c.name)
  },
  relatedArtistsCategoriesByCurrentCategory: (state, getters, rootState, rootGetters): Category[] => {
    const category = rootGetters['category-next/getCurrentCategory']
    return getters.relatedArtistsCategoriesByCategoryId(category.id)
  }
}

export default getters

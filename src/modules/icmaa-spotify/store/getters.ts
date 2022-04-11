import { GetterTree } from 'vuex'
import config from 'config'
import SpotifyState from '../types/SpotifyState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<SpotifyState, RootState> = {
  isInCategoryAllowList: (state) => (category: Category): boolean => {
    const { parentCategoryWhitelist } = config.icmaa_spotify
    return category.path && parentCategoryWhitelist.filter(parentId => category.path.split('/').map(Number).includes(parentId)).length > 0
  },
  getRelatedArtists: (state) => state.relatedArtists,
  getRelatedArtistsByCategoryId: (state) => (id: number): string[] => state.relatedArtists[id] || [],
  getRelatedArtistsCategoriesByCategoryId: (state, getters, rootState, rootGetters) => (id: number): Category[] => {
    return getters.getRelatedArtistsByCategoryId(id)
      .map(name => rootGetters['icmaaCategoryExtras/getCategoryBy']('name', name))
      .filter(c => c && c.name)
  },
  getRelatedArtistsCategoriesByCurrentCategory: (state, getters, rootState, rootGetters): Category[] => {
    const category = rootGetters['icmaaCategoryExtras/getCurrentCategory']
    if (!category) return []
    return getters.getRelatedArtistsCategoriesByCategoryId(category.id)
  },
  areCurrentRelatedCategoriesLoaded: (state, getters, rootState, rootGetters): boolean => {
    const category = rootGetters['icmaaCategoryExtras/getCurrentCategory']
    if (!category) return true
    return !!state.relatedArtists[category.id]
  }
}

export default getters

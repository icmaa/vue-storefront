import { GetterTree } from 'vuex'
import CategoryExtrasState, { CategoryExtrasStateItem } from '../../types/CategoryExtrasState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category';
import RootState from '@vue-storefront/core/types/RootState'
import { Logo } from '../../helpers/categoryExtras/logo'

const getters: GetterTree<CategoryExtrasState, RootState> = {
  categoryExtras: (state) => state.items,
  categoryExtrasByUrlKey: (state) => (identifier): CategoryExtrasStateItem => {
    return state.items.find(item => item.identifier === identifier)
  },
  categoryExtrasByCurrentCategory: (state, getters, rootState, rootGetters): CategoryExtrasStateItem|boolean => {
    const category = rootGetters['category-next/getCurrentCategory']
    return category ? getters.categoryExtrasByUrlKey(category.url_key) : false
  },
  categoryBy: (state, getters, rootState, rootGetters) => (key: string, value: any): Category|boolean => {
    return rootGetters['category-next/getCategories'].find(c => c[key] === value)
  },
  logolineItems: (state, getters, rootState, rootGetters) => (categories: Category[], type: string = 'crossreferenceInLogoline'): Logo[] => {
    let logos = []
    categories.forEach(c => {
      const extras = getters.categoryExtrasByUrlKey(c.url_key)
      if (extras && extras.hasLogo && extras[type]) {
        logos.push(new Logo(c))
      }
    })

    return logos
  },
  spotifyLogolineItemsByCurrentCategory: (state, getters, rootState, rootGetters): Logo[]|boolean => {
    const relatedArtistsCategories = rootGetters['icmaaSpotify/relatedArtistsCategoriesByCurrentCategory']
    if (relatedArtistsCategories.length > 0) {
      return getters.logolineItems(relatedArtistsCategories)
    }

    return false
  }
}

export default getters

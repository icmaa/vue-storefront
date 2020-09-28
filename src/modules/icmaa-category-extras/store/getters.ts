import { GetterTree } from 'vuex'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import CategoryExtrasState, { CategoryExtras, CategoryExtrasContentHeaderContent } from '../types/CategoryExtrasState'
import RootState from '@vue-storefront/core/types/RootState'
import { Logo } from '../helpers/categoryExtras/logo'
import { getCategoryExtrasKeyByAttribute, mapCategoryExtrasAttributes } from '../helpers/'
import isEmpty from 'lodash-es/isEmpty'

const getters: GetterTree<CategoryExtrasState, RootState> = {
  getCategoryExtrasByUrlKey: (state, getters, rootState, rootGetters) => (url_key: string): CategoryExtras => {
    let category: Category = rootGetters['category-next/getCategories'].find(c => c.url_key === url_key)
    if (category) {
      return mapCategoryExtrasAttributes(category)
    }

    return null
  },
  getCategoryExtrasByCurrentCategory: (state, getters): CategoryExtras|boolean => {
    let category: Category = getters.getCurrentCategory
    if (category) {
      return mapCategoryExtrasAttributes(category)
    }

    return null
  },
  getCurrentCategory: (state, getters, rootState, rootGetters): Category|boolean => {
    let category = rootGetters['category-next/getCurrentCategory']
    if (!category || isEmpty(category)) {
      category = getters.getCurrentProductDepartmentCategory
    }

    return category
  },
  getCategoryBy: (state, getters, rootState, rootGetters) => (key: string, value: any): Category|boolean => {
    return rootGetters['category-next/getCategories'].find(c => c[key] === value)
  },
  getLogolineItems: () => (categories: Category[], type: string|boolean = false): Logo[] => {
    let logos: Logo[] = []
    const typeKey: string = type ? getCategoryExtrasKeyByAttribute(type as string) : ''

    categories.forEach(c => {
      if (c['ceHasLogo'] === true && (!type || (c[typeKey] && c[typeKey] === true))) {
        logos.push(new Logo(c, c['ceCluster']))
      }
    })

    return logos
  },
  getSpotifyLogolineItemsByCurrentCategory: (state, getters, rootState, rootGetters): Logo[]|boolean => {
    const relatedArtistsCategories = rootGetters['icmaaSpotify/getRelatedArtistsCategoriesByCurrentCategory']
    if (relatedArtistsCategories.length > 0) {
      return getters.getLogolineItems(relatedArtistsCategories)
    }

    return false
  },
  getCurrentProductDepartmentCategory: (state, getters, rootState, rootGetters): Category|boolean => {
    const product = rootGetters['product/getCurrentProduct']
    if (product && product.category) {
      const { band, brand } = product
      return getters.getCategoryBy('ceAccount', band || brand)
    }

    return false
  },
  getContentHeaderByUrlKey: (state) => (url_key: string): CategoryExtrasContentHeaderContent[] | boolean => {
    return state.categoryContentHeader[url_key] || false
  },
  getContentHeaderByCurrentCategory: (state, getters, rootState, rootGetters): CategoryExtrasContentHeaderContent[] | boolean => {
    const currentCategory: Category = rootGetters['category-next/getCurrentCategory']
    return getters.getContentHeaderByUrlKey(currentCategory.url_key)
  }
}

export default getters

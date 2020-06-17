import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ProductState from '@vue-storefront/core/modules/catalog/types/ProductState'
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types'
import config, { icmaa } from 'config'
import { Logger } from '@vue-storefront/core/lib/logger'

import cloneDeep from 'lodash-es/cloneDeep'
import uniqBy from 'lodash-es/uniqBy'

import { getMediaGallery, configurableChildrenImages } from '@vue-storefront/core/modules/catalog/helpers'

const actions: ActionTree<ProductState, RootState> = {
  /**
   * Clone of originial `product/setProductGallery`
   *
   * Changes:
   * * When `mergeConfigurableChildren` is disabled, just show media-gallery items.
   * * Refactor to avoid redundant code.
   */
  setProductGallery ({ commit }, { product }) {
    let gallery = []
    if (product.type_id === 'configurable' && product.hasOwnProperty('configurable_children')) {
      if (!config.products.gallery.mergeConfigurableChildren && product.is_configured) {
        gallery = uniqBy(getMediaGallery(product), 'src')
      } else {
        gallery = uniqBy(configurableChildrenImages(product).concat(getMediaGallery(product)), 'src')
      }
    } else {
      gallery = uniqBy(configurableChildrenImages(product).concat(getMediaGallery(product)), 'src')
    }

    commit(
      types.PRODUCT_SET_GALLERY,
      gallery.filter(f => f.src && f.src !== config.images.productPlaceholder)
    )
  },
  /**
   * Clone of originial `product/loadProductBreadcrumbs`
   *
   * Changes:
   * * Load only parent categories containing `icmaa.breadcrumbs.path` items in path
   * * This way we can prior categories of products to be used as parent category
   */
  async loadProductBreadcrumbs ({ dispatch, rootGetters }, { product } = {}) {
    if (product && product.category_ids) {
      const currentCategory = rootGetters['category-next/getCurrentCategory']

      let breadcrumbCategory
      const onlyActive = false
      const { path } = icmaa.breadcrumbs
      const categoryFilters = Object.assign(
        { 'id': [...product.category_ids], path },
        cloneDeep(config.entities.category.breadcrumbFilterFields)
      )

      const categories = await dispatch(
        'category-next/loadCategories',
        { filters: categoryFilters, onlyActive, reloadAll: true },
        { root: true }
      )

      if (currentCategory && currentCategory.id && (categories.findIndex(category => category.id === currentCategory.id) >= 0)) {
        breadcrumbCategory = currentCategory // use current category if set and included in the filtered list
      } else {
        breadcrumbCategory = categories.sort((a, b) => (a.level > b.level) ? -1 : 1)[0] // sort starting by deepest level
      }

      await dispatch('category-next/loadCategoryBreadcrumbs', { category: breadcrumbCategory, currentRouteName: product.name }, { root: true })
    }
  },
  /**
   * Update configuration by mutation
   */
  updateConfiguration ({ commit, getters }, { option }): void {
    const configuration = Object.assign({}, getters.getCurrentProductConfiguration, { [option.type]: option })
    commit(types.PRODUCT_SET_CURRENT_CONFIGURATION, configuration)
  },
  async updateBundleOptions ({ commit, dispatch, getters }, option: { optionId: string, productLink: any, [key: string]: any }) {
    const { optionId, productLink } = option
    commit(types.PRODUCT_SET_BUNDLE_OPTION, { optionId, optionQty: productLink.qty, optionSelections: [ parseInt(productLink.id) ] })
    dispatch('setBundleOptions', { product: getters.getCurrentProduct, bundleOptions: getters.getCurrentBundleOptions })
  }
}

export default actions

import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ProductState from '@vue-storefront/core/modules/catalog/types/ProductState'
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types'
import { configurableChildrenImages } from '@vue-storefront/core/modules/catalog/helpers'
import config, { icmaa } from 'config'

import { getMediaGallery } from 'icmaa-catalog/helpers'

import cloneDeep from 'lodash-es/cloneDeep'
import uniqBy from 'lodash-es/uniqBy'

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
      gallery = uniqBy(getMediaGallery(product), 'src')
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
   * * This way we can prior categories of products to be used as parent category (department categories by product)
   * * Only add product-name to current path if a path exists – this to use existing category-path when
   *   browsing through clothing categories
   * * Don't load categories using `loadingCategories` action as it will overwrite existing ones and
   *   the category-extras will disappear
   */
  async loadProductBreadcrumbs ({ dispatch, rootGetters }, { product } = {}) {
    if (product && product.category_ids) {
      const routes = rootGetters['breadcrumbs/getBreadcrumbsRoutes']
      if (routes.length > 0 && rootGetters['breadcrumbs/isPreserved']) {
        await dispatch('breadcrumbs/set', { current: product.name, routes, preserve: false }, { root: true })
        return
      }

      const currentCategory = rootGetters['icmaaCategoryExtras/getCurrentCategory']

      let breadcrumbCategory
      if (currentCategory && currentCategory.id) {
        breadcrumbCategory = currentCategory // use current category if set and included in the filtered list
      } else {
        const existingCategories = rootGetters['category-next/getCategories'].map(c => c.id)
        const fetchCategories = product.category_ids.filter(id => !existingCategories.includes(id))

        const { path } = icmaa.breadcrumbs
        const filters = Object.assign(
          { id: fetchCategories, path },
          cloneDeep(config.entities.category.breadcrumbFilterFields)
        )

        const categories = await dispatch('category-next/findCategories', { filters }, { root: true })

        breadcrumbCategory = categories.sort((a, b) => (a.level > b.level) ? -1 : 1)[0] // sort starting by deepest level
      }

      await dispatch('category-next/loadCategoryBreadcrumbs', { category: breadcrumbCategory, currentRouteName: product.name, preserve: false }, { root: true })
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

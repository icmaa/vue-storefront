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
  async updateConfiguration ({ dispatch, commit, getters }, { option }): Promise<{ selectedVariant: any, configuration: any }> {
    const configuration = Object.assign({}, getters.getCurrentProductConfiguration, { [option.type]: option })
    const selectedVariant = await dispatch('getProductVariant', {
      product: getters.getCurrentProduct,
      configuration
    })

    commit(types.PRODUCT_SET_CURRENT_CONFIGURATION, selectedVariant ? configuration : {})

    return { selectedVariant, configuration }
  },
  async updateBundleOptions ({ commit, dispatch, getters }, option: { optionId: string, productLink: any, [key: string]: any }) {
    const { optionId, productLink } = option
    commit(types.PRODUCT_SET_BUNDLE_OPTION, { optionId, optionQty: productLink.qty, optionSelections: [ parseInt(productLink.id) ] })
    dispatch('setBundleOptions', { product: getters.getCurrentProduct, bundleOptions: getters.getCurrentBundleOptions })
  },
  /**
   * Clone of originial `product/setupAssociated`
   *
   * Changes:
   * * Disable price calculation by child products in bundled products by config flag `calculateBundledPriceByChildren`.
   */
  setupAssociated (context, { product, skipCache = true }): Promise<any> {
    let subloaders = []
    if (product.type_id === 'grouped') {
      product.price = 0
      product.price_incl_tax = 0
      Logger.debug(product.name + ' SETUP ASSOCIATED', product.type_id)()
      if (product.product_links && product.product_links.length > 0) {
        for (let pl of product.product_links) {
          if (pl.link_type === 'associated' && pl.linked_product_type === 'simple') { // prefetch links
            Logger.debug('Prefetching grouped product link for ' + pl.sku + ' = ' + pl.linked_product_sku)()
            subloaders.push(context.dispatch('single', {
              options: { sku: pl.linked_product_sku },
              setCurrentProduct: false,
              selectDefaultVariant: false,
              skipCache: skipCache
            }).catch(err => { Logger.error(err) }).then((asocProd) => {
              if (asocProd) {
                pl.product = asocProd
                pl.product.qty = 1
                product.price += pl.product.price
                product.price_incl_tax += pl.product.price_incl_tax
                product.tax += pl.product.tax
              } else {
                Logger.error('Product link not found', pl.linked_product_sku)()
              }
            }))
          }
        }
      } else {
        Logger.error('Product with type grouped has no product_links set!', product)()
      }
    }
    if (product.type_id === 'bundle') {
      const calculateBundledPriceByChild =
        config.icmaa_catalog.entities.product.calculateBundledPriceByChildren || false
      if (calculateBundledPriceByChild) {
        product.price = 0
        product.price_incl_tax = 0
      }
      Logger.debug(product.name + ' SETUP ASSOCIATED', product.type_id)()
      if (product.bundle_options && product.bundle_options.length > 0) {
        for (let bo of product.bundle_options) {
          let defaultOption = bo.product_links.find((p) => { return p.is_default })
          if (!defaultOption) defaultOption = bo.product_links[0]
          for (let pl of bo.product_links) {
            Logger.debug('Prefetching bundle product link for ' + bo.sku + ' = ' + pl.sku)()
            subloaders.push(context.dispatch('single', {
              options: { sku: pl.sku },
              setCurrentProduct: false,
              selectDefaultVariant: false,
              skipCache: skipCache
            }).catch(err => { Logger.error(err) }).then((asocProd) => {
              if (asocProd) {
                pl.product = asocProd
                pl.product.qty = pl.qty

                if (calculateBundledPriceByChild && pl.id === defaultOption.id) {
                  product.price += pl.product.price * pl.product.qty
                  product.price_incl_tax += pl.product.price_incl_tax * pl.product.qty
                  product.tax += pl.product.tax * pl.product.qty
                }
              } else {
                Logger.error('Product link not found', pl.sku)()
              }
            }))
          }
        }
      }
    }
    return Promise.all(subloaders)
  }
}

export default actions

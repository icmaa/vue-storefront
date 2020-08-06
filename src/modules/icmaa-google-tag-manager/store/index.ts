import { Module } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatValue } from 'icmaa-config/helpers/price'
import Product from '@vue-storefront/core/modules/catalog/types/Product'

import GoogleTagManagerState, { RouteEvent, AttributeMapItem } from '../types/GoogleTagManagerState'
import { googleTagManager } from 'config'

import pick from 'lodash-es/pick'
import isEmpty from 'lodash-es/isEmpty'

export const icmaaGoogleTagManagerModule: Module<GoogleTagManagerState, any> = {
  namespaced: true,
  state: {
    key: null,
    enabled: false,
    queuedRouteEvent: false,
    lastOrderId: ''
  },
  mutations: {
    'ICMAA_GTM/ENABLE': (state, enabled: boolean) => {
      state.enabled = enabled
    },
    'ICMAA_GTM/UPDATE_EVENT': (state, event: RouteEvent | boolean) => {
      state.queuedRouteEvent = Object.assign({}, state.queuedRouteEvent, event)
      console.error('ICMAA_GTM/UPDATE_EVENT', state.queuedRouteEvent)
    },
    'ICMAA_GTM/RESET_EVENT': (state) => {
      state.queuedRouteEvent = false
    },
    'ICMAA_GTM/SET_LAST_ORDER_ID': (state, orderId) => {
      state.lastOrderId = orderId
    }
  },
  actions: {
    enable ({ commit }, enable: boolean = true) {
      commit('ICMAA_GTM/ENABLE', enable)
    },
    updateEvent ({ commit }, event: RouteEvent) {
      commit('ICMAA_GTM/UPDATE_EVENT', event)
    },
    resetEvent ({ commit }) {
      commit('ICMAA_GTM/RESET_EVENT')
    },
    setLastOrderId ({ commit }, orderId: string) {
      commit('ICMAA_GTM/SET_LAST_ORDER_ID', orderId)
    }
  },
  getters: {
    enabled: (state): boolean => state.enabled,
    getQueuedRouteEvent: (state): RouteEvent | boolean => state.queuedRouteEvent,
    getProductDTO: (state, getters, rootState, rootGetters) => (item, attributeMap?: string[] | AttributeMapItem[]): Product | boolean => {
      let product: any = {}

      if (!attributeMap) {
        attributeMap = googleTagManager.productAttributes
      }

      attributeMap.forEach(attribute => {
        const isObject = typeof attribute === 'object'
        const attributeField: string = isObject ? attribute.field : attribute
        const attributeName: string = isObject ? attribute.name || attributeField : attribute
        const attributeType: string|boolean = isObject ? attribute.type || false : false

        if (
          item.hasOwnProperty(attributeField) ||
          product.hasOwnProperty(attributeName)
        ) {
          const value = item[attributeField] || product[attributeName]
          if (value) {
            switch (attributeType) {
              case 'price':
                product[attributeName] = formatValue(value, 'en-US')
                break
              case 'attribute':
                product[attributeName] = rootGetters['attribute/getOptionLabel']({ attributeKey: attributeField, optionId: value })
                break
              case 'children':
                product[attributeName] = value.map(v => pick(v, ['name', 'id', 'price', 'sku']))
                break
              case 'category':
                product[attributeName] = value.map(v => pick(v, ['name', 'category_id']))
                break
              default:
                product[attributeName] = value
            }
          }
        }
      })

      return !isEmpty(product) ? product : false
    },
    gtmEventPayload: (state, getters, rootState, rootGetters) => (type?: 'product' | 'category') => {
      let DTO = {}

      const storeView = currentStoreView()
      const { currencyCode } = storeView.i18n

      switch (type) {
        case 'product':
          const currentProduct = getters.getProductDTO(rootGetters['product/getCurrentProduct'])
          if (!currentProduct) {
            return false
          }

          DTO = {
            event: 'icmaa-product-view',
            ecommerce: {
              currencyCode,
              detail: {
                products: [currentProduct]
              }
            }
          }

          break

        case 'category':
          const category = rootGetters['category-next/getCurrentCategory']
          const products = rootGetters['category-next/getCategoryProducts']
            .slice(0, googleTagManager.categoryProductCount)
            .map(p => getters.getProductDTO(p, googleTagManager.categoryProductAttributes))

          DTO = {
            event: 'icmaa-category-view',
            ecommerce: {
              currencyCode,
              categoryId: category.id,
              categoryName: category.name,
              impressions: products
            }
          }

          break
      }

      const defaultDTO = {
        'event': 'icmaa-page-view',
        'customerLoggedIn': rootGetters['user/isLoggedIn'],
        'customerEmail': rootGetters['user/getUserEmail']
      }

      return Object.assign(defaultDTO, DTO)
    },
    getLastOrderId: (state): string => state.lastOrderId
  }
}

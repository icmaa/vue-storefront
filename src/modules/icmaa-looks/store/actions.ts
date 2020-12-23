import { entities } from 'config'
import { ActionTree } from 'vuex'
import { single as singleAbstract, list as listAbstract, MutationTypesInterface, SingleOptionsInterface, ListOptionsInterface } from 'icmaa-cms/store/abstract/actions'

import Product from 'core/modules/catalog/types/Product'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { SearchQuery } from 'storefront-query-builder'

import { stateKey } from './'
import * as types from './mutation-types'
import LooksState, { Look } from '../types/LooksState'
import RootState from '@vue-storefront/core/types/RootState'

const documentType = 'look'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_LOOKS_ADD,
  upd: types.ICMAA_LOOKS_UPD,
  rmv: types.ICMAA_LOOKS_RMV
}

const actions: ActionTree<LooksState, RootState> = {
  single: async (context, options: SingleOptionsInterface): Promise<Look> =>
    singleAbstract<Look>({ documentType, mutationTypes, stateKey, context, options }),
  list: async (context, { page = 1, size = 8 }): Promise<Look[]> => {
    const options: ListOptionsInterface = { page, size, sort: 'created:desc' }
    return listAbstract<Look>({ documentType, mutationTypes, stateKey, context, options })
  },
  getLookProducts: async ({ dispatch, commit, getters, rootGetters }, skus: string[]): Promise<Product[]> => {
    const query = new SearchQuery()
    const options = { separateSelectedVariant: rootGetters['category-next/separateSelectedVariantInProductList'] }
    const { includeFields, excludeFields } = entities.productList

    const existingProducts: string[] = getters.getExistingProducts
    skus = skus.filter(sku => !existingProducts.includes(sku))

    addDefaultProductFilter(query, true)
    query.applyFilter({ key: 'sku', value: { 'in': skus } })

    const result = await dispatch('product/findProducts', { query, includeFields, excludeFields, options }, { root: true })
    const products: Product[] = result.items

    commit(types.ICMAA_LOOKS_PRODUCTS_ADD, { products })

    return products
  }
}

export default actions

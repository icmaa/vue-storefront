import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import AttributeState from '@vue-storefront/core/modules/catalog/types/AttributeState'
import { optionLabel } from '@vue-storefront/core/modules/catalog-next/helpers/optionLabel'

const getters: GetterTree<AttributeState, RootState> = {
  getOptionLabel: (state) => ({ attributeKey, searchBy = 'code', optionId }) => {
    return optionLabel(state, { attributeKey, searchBy, optionId })
  }
}

export default getters

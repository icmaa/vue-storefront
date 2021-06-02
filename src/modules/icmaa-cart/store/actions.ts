import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'

import connectActions from './actions/connectActions'
import couponActions from './actions/couponActions'
import itemActions from './actions/itemActions'
import methodsActions from './actions/methodsActions'
import synchronizeActions from './actions/synchronizeActions'
import totalsActions from './actions/totalsActions'

const actions: ActionTree<CartState, RootState> = {
  ...connectActions,
  ...couponActions,
  ...itemActions,
  ...methodsActions,
  ...synchronizeActions,
  ...totalsActions
}

export default actions

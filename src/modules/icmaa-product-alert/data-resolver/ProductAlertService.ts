import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'

const addProductStockAlert = (product_id: string): Promise<boolean> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_productalert.endpoint) + '/stock?token={{token}}',
    payload: {
      method: 'POST',
      body: JSON.stringify({ product_id })
    }
  }).then(resp => resp.code === 200)

const removeProductStockAlert = (product_id: string): Promise<boolean> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_productalert.endpoint) + '/stock?token={{token}}',
    payload: {
      method: 'DELETE',
      body: JSON.stringify({ product_id })
    }
  }).then(resp => resp.code === 200)

const listProductStockAlerts = (): Promise<boolean|string[]> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_productalert.endpoint) + '/stocklist?token={{token}}',
    is_result_cacheable: true,
    silent: true
  }).then(resp => resp.code === 200 ? resp.result.map(a => a.product_id) : false)

export default {
  addProductStockAlert,
  removeProductStockAlert,
  listProductStockAlerts
}

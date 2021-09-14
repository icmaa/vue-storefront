import { icmaa_checkout } from 'config'
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'

const getShippingMethods = async (payload: any): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_checkout.endpoint + icmaa_checkout.endpoints.shippingMethods),
    payload: {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    silent: true
  });

const syncQuote = async (payload: any): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_checkout.endpoint + icmaa_checkout.endpoints.quote),
    payload: {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    silent: true
  });

const getTotals = async (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_checkout.endpoint + icmaa_checkout.endpoints.quote),
    silent: true
  });

export const CartService = {
  getShippingMethods,
  getTotals,
  syncQuote
}

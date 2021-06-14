import { icmaa_checkout } from 'config'
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'

const placeOrder = (order: any = {}): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_checkout.endpoint + icmaa_checkout.endpoints.order),
    payload: {
      method: 'POST',
      body: JSON.stringify(order)
    }
  })

export const OrderService = {
  placeOrder
}

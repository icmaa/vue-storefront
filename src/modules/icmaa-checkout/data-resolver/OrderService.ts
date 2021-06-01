import { icmaa_checkout } from 'config';
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'

const placeOrder = (order: any): Promise<Task> =>
  TaskQueue.execute({
    url: icmaa_checkout.endpoint + icmaa_checkout.endpoints.order,
    payload: {
      method: 'POST',
      body: JSON.stringify(order)
    }
  })

export const OrderService = {
  placeOrder
}

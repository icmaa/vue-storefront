import { icmaa_paypal } from 'config'
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'

const start = (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.bypass_start),
    payload: {
      method: 'POST'
    }
  })

const shipping = ({ address, methodCode }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.bypass_shipping),
    payload: {
      method: 'POST',
      body: JSON.stringify({ address, methodCode })
    }
  })

const approve = ({ payerId, orderId }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.bypass_approve),
    payload: {
      method: 'POST',
      body: JSON.stringify({ payerId, orderId })
    }
  })

const capture = (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.bypass_capture),
    payload: {
      method: 'POST'
    }
  })

export const PaypalBypassService = {
  start,
  shipping,
  approve,
  capture
}

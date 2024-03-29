import { icmaa_paypal } from 'config'
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'

const start = (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.checkout_start),
    payload: {
      method: 'POST'
    },
    silent: true
  })

const shipping = ({ address, methodCode }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.checkout_shipping),
    payload: {
      method: 'POST',
      body: JSON.stringify({ address, methodCode })
    },
    silent: true
  })

const approve = ({ payerId, orderId }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.checkout_approve),
    payload: {
      method: 'POST',
      body: JSON.stringify({ payerId, orderId })
    },
    silent: true
  })

const capture = ({ email, address, captureResponse }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.checkout_capture),
    payload: {
      method: 'POST',
      body: JSON.stringify({ email, address, captureResponse })
    },
    silent: true
  })

const fail = (payload): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(icmaa_paypal.endpoint + icmaa_paypal?.endpoints?.checkout_fail),
    payload: {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    silent: true
  })

export const PaypalCheckoutService = {
  start,
  shipping,
  approve,
  capture,
  fail
}

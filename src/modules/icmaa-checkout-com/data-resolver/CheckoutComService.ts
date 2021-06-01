import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import config from 'config'

const getPaymentDetails = async (cardToken: string, orderId: string): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.icmaa_checkoutcom.endpoint + config.icmaa_checkoutcom.endpoints.paymentDetails),
    payload: {
      method: 'POST',
      body: JSON.stringify({ cardToken, orderId })
    },
    silent: true
  })

export const CheckoutComService = {
  getPaymentDetails
}

import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import config from 'config'

const getApmList = async (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.icmaa_checkoutcom.endpoint + config.icmaa_checkoutcom.endpoints.apmList),
    payload: {
      method: 'GET'
    },
    silent: true
  })

export const CheckoutComService = {
  getApmList
}

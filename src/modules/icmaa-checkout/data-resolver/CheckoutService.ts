import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'

const getAgreements = (): Promise<boolean> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_checkout.endpoints.agreements),
    silent: true,
    payload: {
      method: 'GET'
    }
  }).then(resp => {
    if (resp.code === 200) {
      return resp.result
    }

    return false
  })

export default {
  getAgreements
}

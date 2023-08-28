import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import { TaskQueue } from '@vue-storefront/core/lib/sync'

const listRecommendations = (payload: Record<string, any>): Promise<{ result: string[], code: number }> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_recommendations?.endpoint || '/api/icmaa-recommendations') + '/list',
    payload: {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  }).then(resp => ({ result: resp.result, code: resp.resultCode }))

export default {
  listRecommendations
}

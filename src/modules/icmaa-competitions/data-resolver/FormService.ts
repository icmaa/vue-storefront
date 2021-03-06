import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'

const sendForm = (spreadsheetId: string, form: Record<string, any>): Promise<boolean> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_competitions.endpoint) + `/form`,
    silent: true,
    payload: {
      method: 'POST',
      body: JSON.stringify({
        spreadsheetId,
        form
      })
    }
  }).then(resp => resp.code === 200)

export default {
  sendForm
}

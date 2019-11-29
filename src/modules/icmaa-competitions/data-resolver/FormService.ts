import config from 'config';
import { processURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'

const sendForm = (googleSheetId: string, form: Record<string, any>): Promise<boolean> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_competitions.endpoint) + `/form`,
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        googleSheetId,
        form
      })
    }
  }).then(resp => resp.code === 200)

export default {
  sendForm
}

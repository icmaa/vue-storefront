import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import config from 'config'
import { NewsletterVoucher } from '../types/NewsletterState'

const headers = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json'
}

const getVoucher = async (options: { email: string, rule: number }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.newsletter.endpoint_voucher.default),
    payload: {
      method: 'POST',
      mode: 'cors',
      headers,
      body: JSON.stringify(options)
    },
    silent: true
  })

const getBirthdayVoucher = async (options: { email: string }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.newsletter.endpoint_voucher.birthday),
    payload: {
      method: 'POST',
      mode: 'cors',
      headers,
      body: JSON.stringify(options)
    },
    silent: true
  })

export const NewsletterService: any = {
  getVoucher,
  getBirthdayVoucher
}

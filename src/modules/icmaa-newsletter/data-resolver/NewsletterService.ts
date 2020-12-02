import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import config from 'config'

const getVoucher = async (options: { email: string, rule: number }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.newsletter.endpoint_voucher.default),
    payload: {
      method: 'POST',
      body: JSON.stringify(options)
    },
    silent: true
  })

const getBirthdayVoucher = async (options: { email: string }): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.newsletter.endpoint_voucher.birthday),
    payload: {
      method: 'POST',
      body: JSON.stringify(options)
    },
    silent: true
  })

export const NewsletterService: any = {
  getVoucher,
  getBirthdayVoucher
}

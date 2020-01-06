import config from 'config';
import { processURLAddress } from '@vue-storefront/core/helpers';
import { TaskQueue } from '@vue-storefront/core/lib/sync'

const checkCoupon = (coupon_code: string): Promise<boolean> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_coupon.endpoint) + '/stock?token={{token}}',
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ coupon_code })
    }
  }).then(resp => resp.code === 200)

export default {
  checkCoupon
}

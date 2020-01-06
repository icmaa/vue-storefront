import config from 'config';
import { processURLAddress } from '@vue-storefront/core/helpers';
import { TaskQueue } from '@vue-storefront/core/lib/sync';

const checkCoupon = (coupon: string, pin: string): Promise<string> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_coupon.endpoint) + '/coupon?token={{token}}',
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ coupon: coupon, pin: pin })
    }
  }).then(resp => resp.payload);

export default {
  checkCoupon
};

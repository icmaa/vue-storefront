import config from 'config';
import { processURLAddress } from '@vue-storefront/core/helpers';
import { TaskQueue } from '@vue-storefront/core/lib/sync';
import { CouponResult } from '../types/CouponState'

const loadCoupon = (number: string, pin: string): Promise<CouponResult> =>
  TaskQueue.execute({
    url: processURLAddress(config.icmaa_coupon.endpoint) + '/index?token={{token}}',
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ number: number, pin: pin })
    }
  }).then(resp => resp.result);

export default {
  loadCoupon
};

import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import config from 'config'

const getWishlist = async (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.icmaa_wishlist.endpoint + '/index?token={{token}}'),
    silent: true
  })

const addWishlistItems = async (productIds: string[]): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.icmaa_wishlist.endpoint + '/index?token={{token}}'),
    payload: {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds })
    },
    silent: true
  })

const removeWishlistItems = async (productIds: string[]): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.icmaa_wishlist.endpoint + '/index?token={{token}}'),
    payload: {
      method: 'DELETE',
      body: JSON.stringify({ product_ids: productIds })
    },
    silent: true
  })

export const WishlistService = {
  getWishlist,
  addWishlistItems,
  removeWishlistItems
}

import config from 'config'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import { Logger } from '@vue-storefront/core/lib/logger'

export const isCategoryInWhitelist = (category: Category) => {
  const { parentCategoryWhitelist } = config.icmaa_spotify
  return parentCategoryWhitelist.filter(parentId => category.path.split('/').map(Number).includes(parentId)).length > 0
}

import { isServer } from '@vue-storefront/core/helpers'
// import { claimCollection } from 'theme/store/claims'

export const isEnabled = (config: any): boolean => {
  const { id } = config
  return !isServer && typeof id === 'string' && id.length > 0
}

// export const isAccepted = async (config: any): Promise<boolean> => {
//   const { forceCookieAccept } = config.googleTagManager
//   const cookie = await claimCollection(false).getItem('cookiesAccepted')
//   return (!forceCookieAccept || (cookie && cookie.value === true))
// }

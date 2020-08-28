import { claimCollection } from 'theme/store/claims'

export const isEnabled = (id: any): boolean => (typeof id === 'string' && id.length > 0)

export const isAccepted = async (forceCookieAccept: boolean): Promise<boolean> => {
  return claimCollection(false).getItem('cookiesAccepted')
    .then(cookie => (!forceCookieAccept || (cookie && cookie.value === true)))
}

import i18n from '@vue-storefront/i18n'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'

const createNotification = (message: string, type: string = 'error') =>
  notifications.createNotification({ type, message: i18n.t(message) })

const errorMsgMap = {
  'Your cart has been expired.': createNotification('Sorry, but your cart has been expired. Please try again.'),
  'Your session has been expired.': createNotification('Sorry, but your login has been expired. Please try to login again.'),
  'User is not authroized to access quote:': createNotification('Sorry, but your login has been expired. Please try to login again.'),
  'No quote found for token:': createNotification('Sorry, but there was an error with your cart. Please try again.')
}

const getNotificationByResponse = (message: string) => {
  const errorMsgs = Object.keys(errorMsgMap)
  if (errorMsgs.includes(message)) {
    return errorMsgMap[message]
  } else if (errorMsgs.find(m => m.startsWith(message))) {
    return errorMsgMap[errorMsgs.find(m => m.startsWith(message))]
  }

  return createNotification(message)
}

export default {
  getNotificationByResponse
}

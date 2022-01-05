import i18n from '@vue-storefront/i18n'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'

const createNotification = (message: string, type: string = 'error') =>
  notifications.createNotification({ type, message: i18n.t(message) })

export interface ErrorMsg {
  message: string,
  notification: {
    type: any,
    message: string,
    action1: any
  },
  clearCart: boolean
}

const errorMsgMap: ErrorMsg[] = [
  {
    message: 'Your cart has been expired.',
    notification: createNotification('Sorry, but your cart has been expired. Please try again.'),
    clearCart: true
  },
  {
    message: 'Your cart isn\'t currently active',
    notification: createNotification('Sorry, but your cart isn\'t currently active. Are your still in payment progress?'),
    clearCart: true
  },
  {
    message: 'Your session has been expired.',
    notification: createNotification('Sorry, but your login has been expired. Please try to login again.'),
    clearCart: true
  },
  {
    message: 'User is not authroized to access quote:',
    notification: createNotification('Sorry, but your login has been expired. Please try to login again.'),
    clearCart: true
  },
  {
    message: 'No quote found for token:',
    notification: createNotification('Sorry, but there was an error with your cart. Please try again.'),
    clearCart: true
  },
  {
    message: 'User is not authroized to access',
    notification: createNotification('Sorry, your session is not authorized – maybe it has been expired. Please try to login again.'),
    clearCart: true
  },
  {
    message: 'Invalid shipping method.',
    notification: createNotification('We had to updated your shipping-method due to changes in your order. Please re-confirm your shipping-method.', 'warning'),
    clearCart: false
  }
]

export const getKnownError = (message: string): ErrorMsg | boolean => {
  return errorMsgMap.find(m => m.message === message || m.message.startsWith(message)) || false
}

export const isKnownError = (message: string): boolean => !!getKnownError(message)

export const getNotificationByResponse = (message: string) => {
  if (isKnownError(message)) {
    return (getKnownError(message) as ErrorMsg)?.notification
  }

  return createNotification(message)
}

export default {
  getKnownError,
  isKnownError,
  getNotificationByResponse
}

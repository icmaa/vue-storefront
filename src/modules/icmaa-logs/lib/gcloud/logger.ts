import { isServer } from '@vue-storefront/core/helpers'
import { coreHooks } from '@vue-storefront/core/hooks'
import { isEnabled } from './helper'

interface Message { type: string, message: any, tag: any, context: any, noDefaultOutput?: boolean }

let logger = (msg: Message): Message => msg

if (!isServer) {
  logger = (msg: Message): Message => {
    // ...custom code here
    return msg
  }
}

export default () => {
  if (!isEnabled || isServer) return
  coreHooks.beforeLogRendered(logger)
}

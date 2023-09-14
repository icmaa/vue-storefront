import { isServer } from '@vue-storefront/core/helpers'

export function getCookie (name) {
  if (isServer) return null
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

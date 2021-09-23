const CheckoutPage = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Checkout.vue')
const SuccessPage = () => import(/* webpackChunkName: "vsf-checkout-success" */ 'icmaa-checkout/pages/CheckoutSuccess.vue')
const CheckoutGatewaySuccess = () => import(/* webpackChunkName: "vsf-checkout-gateway-success" */ 'icmaa-checkout/pages/CheckoutGatewaySuccess.vue')

/**
 * As we register this route dynamically using this module, it is important to consider the order of
 * module registration. For example: this module was registered after the `icmaa-google-tag-manager` module,
 * which leads into the problem that the `beforeEach` guard of the GTM module won't handle routing events of
 * the ìcmaa-checkout` module as it was registered afterwards. So, keep that in mind.
 */
export default [
  { name: 'checkout', path: '/checkout-v2', component: CheckoutPage, meta: { layout: 'empty', gtm: 'checkout' } },
  { name: 'checkout-success', path: '/(checkout|order)-success', component: SuccessPage },
  { name: 'checkout-gateway-success', path: '/checkout-gateway-success', component: CheckoutGatewaySuccess, meta: { layout: 'empty' } }
]

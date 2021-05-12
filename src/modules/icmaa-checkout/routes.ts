const CheckoutPage = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Checkout.vue')
const SuccessPage = () => import(/* webpackChunkName: "vsf-checkout-success" */ 'theme/pages/CheckoutSuccess.vue')

/**
 * As we register this route dynamically using this module, it is important to consider the order of
 * module registration. For example: this module was registered after the `icmaa-google-tag-manager` module,
 * which leads into the problem that the `beforeEach` guard of the GTM module won't handle routing events of
 * the ìcmaa-checkout` module as it was registered afterwards. So, keep that in mind.
 */
export default [
  { name: 'checkout', path: '/checkout', component: CheckoutPage },
  { name: 'checkout-success', path: '/(checkout|order)-success', component: SuccessPage }
]

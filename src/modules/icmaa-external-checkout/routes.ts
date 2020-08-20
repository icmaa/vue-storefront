const ExternalSuccessPage = () => import(/* webpackChunkName: "vsf-order-success" */ './pages/ExternalSuccess.vue')

/**
 * As we register this route dynamically using this module, it is important to consider the order of
 * module registration. For example: this module was registered after the `icmaa-google-tag-manager` module,
 * which leads into the problem that the `beforeEach` guard of the GTM module won't handle routing events of
 * the ìcmaa-external-checkout` module as it was registered afterwards. So, keep that in mind.
 */
export default [
  { name: 'external-thank-you', path: '/order-success', component: ExternalSuccessPage }
]

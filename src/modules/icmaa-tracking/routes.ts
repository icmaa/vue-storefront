const Tracking = () => import(/* webpackChunkName: "vsf-icmaa-order-tracking" */ 'icmaa-tracking/pages/Tracking.vue')

export default [
  { name: 'order-tracking', path: '/order-tracking', component: Tracking }
]

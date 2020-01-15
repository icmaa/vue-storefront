// Route components
const ServiceComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/Service.vue')
const ServiceRTEComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-rte" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/ServiceRTE.vue')

export const routes: any = [
  // Custom cms routes, like /service or /festivals
  { name: 'service', path: '/:identifier', component: ServiceComponent },
  { name: 'service-rte', path: '/:identifier', component: ServiceRTEComponent }
]

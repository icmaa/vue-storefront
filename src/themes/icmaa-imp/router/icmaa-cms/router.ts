// Route components
const ServiceComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service" */ 'theme/pages/Cms/Service.vue')
const ServiceRTEComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-rte" */ 'theme/pages/Cms/ServiceRTE.vue')
const ServiceSizeComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-size" */ 'theme/pages/Cms/ServiceSize.vue')
const ServiceContactComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-contact" */ 'theme/pages/Cms/ServiceContact.vue')
const ServiceWiderrufComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-widerruf" */ 'theme/pages/Cms/ServiceWiderruf.vue')
const ServiceJobsComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-jobs" */ 'theme/pages/Cms/ServiceJobs.vue')
const NewsletterComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-newsletter-landingpage" */ 'icmaa-newsletter/pages/Newsletter.vue')
const AffiliateComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-affiliate" */ 'theme/pages/Cms/Affiliate.vue')
const INSDComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-impericon-never-say-die" */ 'theme/pages/Cms/ImpericonNeverSayDie.vue')
const DigitalEventsComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-digital-events" */ 'theme/pages/Cms/DigitalEvents.vue')
const Calendar = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-calendar" */ 'theme/pages/Cms/Calendar.vue')
const NextGeneration = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-next-generation" */ 'theme/pages/Cms/NextGeneration.vue')
const NextGenerationVoting = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-next-generation-voting" */ 'theme/pages/Cms/NextGenerationVoting.vue')

export const routes: any = [
  // Custom cms routes, like /service or /festivals
  { name: 'service', path: '/:identifier', component: ServiceComponent },
  { name: 'service-rte', path: '/:identifier', component: ServiceRTEComponent },
  { name: 'service-size', path: '/:identifier', component: ServiceSizeComponent },
  { name: 'service-contact', path: '/:identifier', component: ServiceContactComponent },
  { name: 'service-widerruf', path: '/:identifier', component: ServiceWiderrufComponent },
  { name: 'service-jobs', path: '/:identifier', component: ServiceJobsComponent },
  { name: 'newsletter', path: '/:identifier', component: NewsletterComponent },
  { name: 'affiliate', path: '/:identifier', component: AffiliateComponent },
  { name: 'impericon-never-say-die', path: '/:identifier', component: INSDComponent },
  { name: 'digital-events', path: '/:identifier', component: DigitalEventsComponent },
  { name: 'xmas-calendar', path: '/:identifier', component: Calendar },
  { name: 'calendar', path: '/:identifier', component: Calendar },
  { name: 'next-generation', path: '/:identifier', component: NextGeneration },
  { name: 'next-generation-voting', path: '/:identifier', component: NextGenerationVoting }
]

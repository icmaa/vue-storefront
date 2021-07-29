// Route components
const ServiceComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/Service.vue')
const ServiceRTEComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-rte" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/ServiceRTE.vue')
const ServiceSizeComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-size" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/ServiceSize.vue')
const ServiceContactComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-contact" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/ServiceContact.vue')
const ServiceWiderrufComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service-widerruf" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/ServiceWiderruf.vue')
const NewsletterComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-newsletter-landingpage" */ 'icmaa-newsletter/pages/Newsletter.vue')
const AffiliateComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-affiliate" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/Affiliate.vue')
const TicketsComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-tickets" */ 'theme/pages/Tickets.vue')
const FestivalComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-festival" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/Festival.vue')
const INSDComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-impericon-never-say-die" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/ImpericonNeverSayDie.vue')
const DigitalEventsComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-digital-events" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/DigitalEvents.vue')
const Calendar = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-calendar" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/Calendar.vue')
const NextGeneration = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-next-generation" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/NextGeneration.vue')
const NextGenerationVoting = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-next-generation-voting" */ 'theme/components/core/blocks/ICMAA/Cms/Pages/NextGenerationVoting.vue')

export const routes: any = [
  // Custom cms routes, like /service or /festivals
  { name: 'service', path: '/:identifier', component: ServiceComponent },
  { name: 'service-rte', path: '/:identifier', component: ServiceRTEComponent },
  { name: 'service-size', path: '/:identifier', component: ServiceSizeComponent },
  { name: 'service-contact', path: '/:identifier', component: ServiceContactComponent },
  { name: 'service-widerruf', path: '/:identifier', component: ServiceWiderrufComponent },
  { name: 'newsletter', path: '/:identifier', component: NewsletterComponent },
  { name: 'affiliate', path: '/:identifier', component: AffiliateComponent },
  { name: 'tickets', path: '/:identifier', component: TicketsComponent },
  { name: 'festival', path: '/:identifier', component: FestivalComponent },
  { name: 'impericon-never-say-die', path: '/:identifier', component: INSDComponent },
  { name: 'digital-events', path: '/:identifier', component: DigitalEventsComponent },
  { name: 'xmas-calendar', path: '/:identifier', component: Calendar },
  { name: 'calendar', path: '/:identifier', component: Calendar },
  { name: 'next-generation', path: '/:identifier', component: NextGeneration },
  { name: 'next-generation-voting', path: '/:identifier', component: NextGenerationVoting }
]

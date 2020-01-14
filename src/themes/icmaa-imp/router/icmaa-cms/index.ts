import { Logger } from '@vue-storefront/core/lib/logger'
import { routes } from './router'

const NAME_PREFIX = 'icmaa-cms-custom'

// Route components
const DefaultComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page" */ 'icmaa-cms/pages/Page.vue')
const DefaultRTEComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-rte" */ 'icmaa-cms/pages/PageRTE.vue')

// Default/fallback routes
routes.unshift(
  { name: 'icmaa-cms-page-rte', path: '/icmaa-cms-page-rte/:identifier', component: DefaultRTEComponent },
  { name: 'icmaa-cms-page', path: '/icmaa-cms-page/:identifier', component: DefaultComponent }
)

export const prefixedName = (name: string): string => NAME_PREFIX + '-' + name

export const icmaaCmsRoutes = routes.map((route, index) => {
  if (index <= 1) {
    // Skip first two routes with default/fallback routes
    return route
  }

  route.path = '/' + [ NAME_PREFIX, route.name ].join('/') + route.path
  route.name = prefixedName(route.name)

  Logger.log('Registered custom cms route:', 'ICMAA', route)()

  return route
})

const IcmaaCmsPage = () => import(/* webpackChunkName: "vsf-icmaa-cms-page" */ 'src/modules/icmaa-cms/pages/Page.vue')

export default [
  { name: 'icmaa-cms-page', path: '/icmaa-cms-page/:identifier', component: IcmaaCmsPage },
  { name: 'icmaa-cms-custom-service', path: '/icmaa-cms-page/:identifier', component: IcmaaCmsPage }
]

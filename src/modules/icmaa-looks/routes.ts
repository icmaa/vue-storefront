const LooksComponent = () => import(/* webpackChunkName: "vsf-looks-list" */ './pages/Looks.vue')

export default [
  { name: 'icmaa-looks', path: '/looks', component: LooksComponent },
  { name: 'icmaa-looks-detail', path: '/looks/:identifier', component: LooksComponent }
]

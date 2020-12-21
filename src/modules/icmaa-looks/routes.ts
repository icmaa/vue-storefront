const LooksComponent = () => import(/* webpackChunkName: "vsf-looks-list" */ './pages/Looks.vue')

export default [
  { name: 'icmaa-looks', path: '/icmaa-looks', component: LooksComponent }
]

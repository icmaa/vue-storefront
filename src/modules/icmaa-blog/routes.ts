const ArticleComponent = () => import(/* webpackChunkName: "vsf-blog-index" */ './pages/Index.vue')
const HomeComponent = () => import(/* webpackChunkName: "vsf-blog-home" */ './pages/Home.vue')

export default [
  { name: 'icmaa-blog', path: '/mag/:identifier', component: ArticleComponent },
  { name: 'icmaa-blog-home', path: '/mag', component: HomeComponent }
]

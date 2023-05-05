const ArticleComponent = () => import(/* webpackChunkName: "vsf-blog-index" */ './pages/Index.vue')

export default [
  { name: 'icmaa-blog-index', path: '/mag', component: ArticleComponent },
  { name: 'icmaa-blog-articles', path: '/mag/:identifier', component: ArticleComponent }
]

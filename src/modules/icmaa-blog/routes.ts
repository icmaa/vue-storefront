const ArticleComponent = () => import(/* webpackChunkName: "vsf-blog-index" */ './pages/Index.vue')

export default [
  { name: 'icmaa-blog', path: '/mag/:identifier', component: ArticleComponent },
  { name: 'icmaa-blog-tag', path: '/mag/t/:tag', component: ArticleComponent },
  { name: 'icmaa-blog-home', path: '/mag', component: ArticleComponent }
]

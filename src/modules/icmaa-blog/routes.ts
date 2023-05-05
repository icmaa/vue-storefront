const ArticleComponent = () => import(/* webpackChunkName: "vsf-blog-article" */ './pages/Article.vue')
const ListComponent = () => import(/* webpackChunkName: "vsf-blog-list" */ './pages/List.vue')

export default [
  { name: 'icmaa-blog-article', path: '/mag/:identifier', component: ArticleComponent },
  { name: 'icmaa-blog-list', path: '/mag', component: ListComponent }
]

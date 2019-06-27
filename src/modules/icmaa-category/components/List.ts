import { mapState, mapGetters } from 'vuex'

export default {
  name: 'IcmaaCategoryList',
  computed: {
    ...mapGetters({ listByParentId: 'icmaaCategory/listByParentId' }),
    rootCategoryId (): number {
      return Number(this.$route.params.parentCategoryId)
    },
    depth (): number {
      return Number(this.$route.query.depth) || 2
    },
    list: function () {
      return this.listByParentId(this.rootCategoryId)
    },
    categories: function () {
      return this.list.list.filter(category => category.is_active === true)
    },
    parent: function () {
      return this.list.parent
    }
  },
  methods: {
    fetchCategories () {
      return this.$store.dispatch('icmaaCategory/list', { parentId: this.rootCategoryId, crawlDepth: this.depth })
    }
  },
  serverPrefetch () {
    return this.fetchCategories();
  }
}

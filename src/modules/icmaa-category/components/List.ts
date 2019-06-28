import { mapGetters } from 'vuex'

export default {
  name: 'IcmaaCategoryList',
  computed: {
    ...mapGetters({ sortedListByParentId: 'icmaaCategory/sortedListByParentId' }),
    rootCategoryId (): number {
      return Number(this.$route.params.parentCategoryId)
    },
    depth (): number {
      return Number(this.$route.query.depth) || undefined
    },
    list: function () {
      return this.sortedListByParentId(this.rootCategoryId)
    },
    parent: function () {
      return this.list.parent
    },
    categories: function () {
      return this.list.list.filter(category => category.is_active === true)
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

import { mapGetters } from 'vuex'
import { CategoryStateCategory } from '../types/CategoryState'
import { extractPrefix } from '../helpers/fetchCategories'

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
    list: function (): CategoryStateCategory[] {
      return this.sortedListByParentId(this.rootCategoryId)
    },
    parent: function (): CategoryStateCategory {
      return this.list.parent
    },
    categories: function (): CategoryStateCategory[] {
      return this.list.list.filter(category => category.is_active === true)
    },
    categoriesGroupedByFirstLetter: function (): { letter: string, list: CategoryStateCategory[] }[] {
      let groups: { letter: string, list: CategoryStateCategory[] }[] = []

      this.categories.forEach(category => {
        let firstChar: string = extractPrefix(category.name).charAt(0)
        let letter: string = /^[a-z]/gmi.test(firstChar) ? firstChar : '#'

        if (!groups.find(g => g.letter === letter)) {
          let list = []
          groups.push({ letter, list })
        }

        groups[groups.findIndex(g => g.letter === letter)].list.push(category)
      })

      return groups
    }
  },
  methods: {
    fetchCategories (): Promise<any> {
      return this.$store.dispatch('icmaaCategory/list', { parentId: this.rootCategoryId, crawlDepth: this.depth })
    }
  },
  serverPrefetch (): Promise<any> {
    return this.fetchCategories();
  }
}

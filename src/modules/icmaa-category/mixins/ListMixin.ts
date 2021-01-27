import { mapGetters } from 'vuex'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import { extractPrefix } from '../helpers'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'

interface Letter {
  letter: string,
  anchor: string,
  list: Category[]
}

export default {
  name: 'IcmaaCategoryList',
  computed: {
    ...mapGetters({
      listByParentId: 'icmaaCategory/listByParentId'
    }),
    rootCategoryId (): number {
      return Number(this.$route.params.parentCategoryId)
    },
    depth (): number {
      return Number(this.$route.params.depth || this.$route.query.depth) || undefined
    },
    list (): Category[] {
      return this.listByParentId(this.rootCategoryId)
    },
    parent (): Category {
      return this.list.parent
    },
    notEmpty (): boolean {
      return (this.list && this.list.list)
    },
    categoriesGroupedByFirstLetter (): Letter[] {
      let groups: Letter[] = []

      this.list.list.forEach(category => {
        let firstChar: string = extractPrefix(category.name).charAt(0)
        let letter: string = /^[a-z]/gmi.test(firstChar) ? firstChar.toUpperCase() : '#'

        if (!groups.find(g => g.letter === letter)) {
          let anchor = letter !== '#' ? letter.toLowerCase() : 'numbers'
          groups.push({ letter, anchor, list: [] })
        }

        groups[groups.findIndex(g => g.letter === letter)].list.push(category)
      })

      return groups
    }
  },
  async asyncData ({ store, route, context }) {
    if (context) {
      context.output.cacheTags
        .add('category')
        .add('cms')
    }

    await store.dispatch(
      'icmaaCategory/list',
      {
        parentId: route.params.parentCategoryId,
        crawlDepth: route.params.depth || route.query.depth
      }
    )
  },
  metaInfo () {
    return !this.notEmpty || {
      title: htmlDecode(this.parent.meta_title || this.parent.name),
      meta: this.parent.meta_description
        ? [{ vmid: 'description', name: 'description', content: htmlDecode(this.parent.meta_description) }]
        : []
    }
  }
}

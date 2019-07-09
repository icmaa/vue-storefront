import { mapGetters } from 'vuex'
import { PageStateItem } from '../types/PageState'
import camelCase from 'lodash-es/camelCase'

export default {
  name: 'IcmaaCmsPage',
  computed: {
    ...mapGetters({ pageByIdentifier: 'icmaaCmsPage/pageByIdentifier' }),
    identifier (): string {
      return this.$route.params.identifier
    },
    page (): PageStateItem {
      return this.pageByIdentifier(this.identifier)
    }
  },
  async asyncData ({ store, route, context }) {
    await store.dispatch(
      'icmaaCmsPage/single', { value: route.params.identifier }
    )
  },
  metaInfo () {
    let meta: any = {}
    const metaKeys = ['title', 'tags', 'description']

    metaKeys.forEach((value) => {
      const key = camelCase('meta-' + value)
      if (this.page.hasOwnProperty(key) && this.page[key] !== null) {
        if (value === 'title') {
          meta[value] = this.page[key]
        } else {
          if (!meta.hasOwnProperty('meta')) {
            meta['meta'] = []
          }

          meta.meta.push({
            name: value,
            content: this.page[key]
          })
        }
      }
    })

    return meta
  }
}

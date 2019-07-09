import { mapGetters } from 'vuex'
import { PageStateItem } from '../types/PageState'

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
      if (this.page.hasOwnProperty('meta-' + value) && this.page['meta-' + value] !== null) {
        if (value === 'title') {
          meta[value] = this.page['meta-' + value]
        } else {
          if (!meta.hasOwnProperty('meta')) {
            meta['meta'] = []
          }

          meta.meta.push({
            name: value,
            content: this.page['meta-' + value]
          })
        }
      }
    })

    return meta
  }
}

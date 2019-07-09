import { mapGetters } from 'vuex'
import { PageStateItem } from '../types/PageState'

import YAML from 'yaml'
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
    },
    pageData (): string {
      return this.page.content
    },
    content (): any|string {
      switch (this.dataType) {
        case 'yaml':
          return YAML.parse(this.pageData)
        case 'json':
          return JSON.parse(this.pageData)
        default:
          return `<div>${this.pageData}</div>`
      }
    }
  },
  methods: {
    componentByText: (text: string): object => {
      return {
        template: `<span>${text}</span>`
      }
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

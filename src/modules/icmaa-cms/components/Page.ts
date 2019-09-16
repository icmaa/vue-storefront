import { mapGetters } from 'vuex'
import { PageStateItem } from '../types/PageState'
import { stringToComponent } from '../helpers'

import YAML from 'yaml'
import camelCase from 'lodash-es/camelCase'

import CmsMetaMixin from 'icmaa-meta/mixins/cmsMeta';

export default {
  name: 'IcmaaCmsPage',
  mixins: [CmsMetaMixin],
  computed: {
    ...mapGetters('icmaaCmsPage', ['getPageByIdentifier']),
    identifier (): string {
      return this.$route.params.identifier
    },
    page (): PageStateItem {
      return this.getPageByIdentifier(this.identifier)
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
          return this.stringToComponent(this.pageData)
      }
    }
  },
  methods: {
    stringToComponent: (text: string): object => stringToComponent(text, 'span')
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
            vmid: value,
            name: value,
            content: this.page[key]
          })
        }
      }
    })

    return meta
  }
}

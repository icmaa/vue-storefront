import { mapState, mapGetters } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'
import config from 'config'

import { Logger } from '@vue-storefront/core/lib/logger';

export default {
  name: 'IcmaaCategoryList',
  computed: {
    ...mapGetters('category', ['getCategories']),
    rootCategoryId (): number {
      return Number(this.$route.params.parentCategoryId)
    },
    categories: function () {
      return this.getCategories
    }
  },
  methods: {
    fetchCategories () {
      Logger.error('Lorem ipsum', 'DEBUG', this.rootCategoryId)()
      return this.$store.dispatch(
        'category/list',
        {
          parent: this.rootCategoryId,
          includeFields: config.entities.optimize && isServer ? config.entities.category.includeFields : null,
          skipCache: isServer
        }
      )
    }
  },
  serverPrefetch () {
    return this.fetchCategories();
  }
}

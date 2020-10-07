<template>
  <div class="t-flex t-flex-wrap t-justify-between t--mx-2" data-test-id="LogoLine">
    <div v-for="(logo, index) in logoLineItems" :key="'logo-' + index" class="t-flex-fix t-px-2" :class="[...columnClassObj]">
      <department-logo v-bind="logo.data()" class="t-flex t-justify-center t-px-4 t-py-2" :class="[ ...logoClassObj, white ? 't-bg-white' : 't-border-base-lightest t-border-b' ]" />
    </div>
    <template v-if="placeholder">
      <div v-for="i in placeholderCount" :key="`placeholder-${i}`" class="t-flex-fix t-px-2" :class="[...columnClassObj]">
        <div class="t-flex t-justify-center t-px-4 t-py-2" :class="[ ...logoClassObj, white ? 't-bg-white' : 't-border-base-lightest t-border-b' ]">
          <div class="t-w-full" :style="{ maxWidth: '74px' }">
            <placeholder ratio="53:27" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCategoryExtrasKeyByAttribute } from 'icmaa-category-extras/helpers'
import { Logo } from 'icmaa-category-extras/helpers/categoryExtras/logo'

import DepartmentLogo from 'theme/components/core/blocks/CategoryExtras/DepartmentLogo'
import Placeholder from 'theme/components/core/blocks/Placeholder'

export default {
  name: 'LogoLine',
  components: {
    DepartmentLogo,
    Placeholder
  },
  props: {
    parentId: {
      type: Number,
      required: true
    },
    staticItems: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 5
    },
    type: {
      type: String,
      default: 'logoline',
      validation: (v) => ['logoline', 'productLogoline'].includes(v)
    },
    white: {
      type: Boolean,
      default: true
    },
    logoClass: {
      type: [String, Array, Object],
      default: ''
    },
    columnClass: {
      type: [String, Array, Object],
      default: ''
    },
    placeholder: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      categoryIds: [],
      categories: []
    }
  },
  computed: {
    ...mapGetters({
      getLogolineItems: 'icmaaCategoryExtras/getLogolineItems',
      allCategories: 'category-next/getCategories',
      cluster: 'user/getCluster'
    }),
    logoLineItems () {
      return this.hasStaticItems ? this.staticLogoLineItems : this.getLogolineItems(this.categories, this.type)
    },
    placeholderCount () {
      return this.limit > this.logoLineItems.length && this.placeholder ? this.limit - this.logoLineItems.length : 0
    },
    logoClassObj () {
      return typeof this.logoClass === 'string' ? [this.logoClass] : this.logoClass
    },
    columnClassObj () {
      return typeof this.columnClass === 'string' ? [this.columnClass] : this.columnClass
    },
    catTypeKey () {
      return getCategoryExtrasKeyByAttribute(this.type)
    },
    hasStaticItems () {
      return this.parentId === 0 && this.staticItems.length > 0
    },
    staticLogoLineItems () {
      return this.staticItems.map(c => new Logo({ category: c.name, link: c.link }))
    }
  },
  methods: {
    async fetchData () {
      if (this.hasStaticItems) {
        return
      }

      const filters = {
        'path': this.parentId,
        'ceHasLogo': true,
        [this.catTypeKey]: true
      }

      if (this.cluster) {
        filters['ceCluster'] = [this.cluster, '']
      }

      // Add custom random sort, rather then build in as the results are not the same
      const sort = {
        field: '_script',
        options: {
          script: 'Math.random()',
          type: 'number',
          order: 'asc'
        }
      }

      const fetchedCategories = await this.$store.dispatch(
        'category-next/findCategoriesWithoutBlacklisting',
        { filters, size: this.limit, onlyActive: true, sort }
      )

      this.categoryIds = fetchedCategories.map(c => c.id)

      // Prevent flickering logoline when clicked
      // because of changing `categories` state property
      this.setCategories()
    },
    setCategories () {
      this.categories = this.allCategories.filter(c => this.categoryIds.includes(c.id))
    }
  },
  async mounted () {
    await this.fetchData()
  },
  watch: {
    async parentId () {
      await this.fetchData()
    },
    logoLineItems (items) {
      if (items.length > 0) {
        this.$emit('loaded')
      }
    }
  }
}
</script>

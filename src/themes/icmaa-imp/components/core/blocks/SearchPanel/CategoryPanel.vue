<template>
  <div class="categories">
    <h4 class="t-mb-2 t-text-xs t-uppercase t-text-base-light">
      {{ $t(title) }}
    </h4>
    <div class="t--mx-4 t-flex t-overflow-scroll t-px-2 t-hide-scrollbar t-scrolling-touch">
      <button-component
        v-for="category in categories"
        :key="category.id"
        type="tag"
        size="sm"
        class="t-mx-2 t-flex-fix"
        @click="goToCategory(category)"
      >
        {{ category.name }}
      </button-component>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { searchPanel } from 'config'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import ButtonComponent from 'theme/components/core/blocks/Button'
import pick from 'lodash-es/pick'

export default {
  name: 'CategoryPanel',
  components: {
    ButtonComponent
  },
  props: {
    title: {
      type: String,
      default: 'Filter by categories'
    },
    categoryIds: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentCategory: 'category-next/getCurrentCategory',
      getCategoryById: 'category-next/getCategoryById'
    }),
    categories () {
      const pathFilter = searchPanel.hideCategoriesFromPath.map(c => c.toString())
      return this.categoryIds
        .map(id => this.getCategoryById(id))
        .filter(c => {
          if (!c) return false
          if (c.path.split('/').includes(pathFilter)) return false
          return true
        })
    }
  },
  methods: {
    goToCategory (category) {
      const gtmCategory = pick(category, ['url_path', 'name', 'id', 'slug'])
      IcmaaGoogleTagManagerExecutors.onSearchPanelCategoryClick({ category: gtmCategory })

      this.$store.dispatch('ui/closeAll')
      if (category.id === this.currentCategory.id) return
      this.$router.push(this.localizedRoute(category.url_path))
    }
  }
}
</script>

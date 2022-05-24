<template>
  <div class="t-flex t-flex-wrap t--mx-4 t-px-4" v-if="isVisible && (description || footerDescription)">
    <div class="t-w-full t-mb-8 md:t-mb-0 t-px-4" v-if="description">
      <h2 class="t-flex t-items-center t-h-10 t-text-1xl t-text-base-dark t-font-thin t-leading-1-em t-mb-4">
        {{ categoryExtras.title }}
      </h2>
      <p class="t-text-base-tone t-text-sm t-leading-snug" v-html="description" />
    </div>
    <div class="t-w-full t-px-4 t-mt-8 t-text-xs t-text-base-lighter t-leading-snug" v-if="footerDescription">
      {{ footerDescription }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CategoryExtrasFooter',
  props: {
    foldDescription: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      descriptionFolded: false
    }
  },
  computed: {
    ...mapGetters({
      category: 'icmaaCategoryExtras/getCurrentCategory',
      categoryExtras: 'icmaaCategoryExtras/getCategoryExtrasByCurrentCategory'
    }),
    isVisible () {
      return this.categoryExtras && this.categoryExtras.active
    },
    description () {
      return this.categoryExtras.description
    },
    footerDescription () {
      // This is the disclaimer text below the footer / weird attribute title
      return this.categoryExtras.descriptionFooter || false
    }
  }
}
</script>

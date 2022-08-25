<template>
  <div class="category-footer" v-if="isVisible && (description || footerContent || footerDescription)">
    <div class="t-mb-8 md:t-mb-0 t-px-4" v-if="description || footerContent">
      <h2 class="t-any category-footer__headline" v-text="categoryExtras.title" v-if="categoryExtras.title" />
      <p class="category-footer__description" v-html="description" v-if="description" />
      <block-wrapper class="category-footer__description" :components="footerContent" v-if="footerContent" />
    </div>
    <div class="t-mt-8 t-text-xs t-text-base-lighter t-leading-snug" v-if="footerDescription">
      {{ footerDescription }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BlockWrapper from 'icmaa-cms/components/Wrapper'

export default {
  name: 'CategoryExtrasFooter',
  components: {
    BlockWrapper
  },
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
    footerContent () {
      return this.categoryExtras.contentFooter
    },
    footerDescription () {
      // This is the disclaimer text below the footer / weird attribute title
      return this.categoryExtras.descriptionFooter || false
    }
  }
}
</script>

<style lang="scss">
.category-footer__headline {
  @apply t-text-1xl t-text-base-dark t-font-thin t-leading-1-em t-mb-4;
}

.category-footer {

  .category-footer__description {
    @apply t-text-base-tone t-text-sm t-leading-snug;

    h2 {
      @apply category-footer__headline;
    }

    p, ul, ol, blockquote {
      &:not(:last-child) {
        @apply t-mb-4;
      }
    }
  }
}

</style>

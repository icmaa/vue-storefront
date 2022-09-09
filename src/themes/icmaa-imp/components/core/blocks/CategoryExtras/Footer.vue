<template>
  <div class="category-footer" v-if="isVisible && (description || footerContent || footerDescription)">
    <div class="t-mb-8 md:t-mb-0 t-px-4" v-if="description || footerContent">
      <h2 class="t-any category-footer__headline" v-text="categoryExtras.title" v-if="categoryExtras.title" />
      <component v-if="description" :is="descriptionComponent" class="category-footer__description" />
      <block-wrapper class="category-footer__description" :components="footerContent" v-if="footerContent" />
    </div>
    <div class="t-mt-8 t-text-xs t-text-base-lighter t-leading-snug" v-if="footerDescription">
      {{ footerDescription }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { stringToComponent } from 'icmaa-cms/helpers'
import BlockWrapper from 'icmaa-cms/components/Wrapper'

export default {
  name: 'CategoryExtrasFooter',
  components: {
    BlockWrapper
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
      /**
       * The fields `description` and `title` are deprecated and will be removec once the migration to the new HTML/RTE field is done.
       * @see https://www.icmaa.info/redmine/issues/258705
       **/
      return this.categoryExtras.description
    },
    descriptionComponent () {
      return stringToComponent(this.description, { wrapper: 'p' })
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
  @apply t-text-1xl t-text-base-dark t-font-extralight t-leading-1-em t-mb-4;
}

.category-footer {

  .purgecsse-plchldr {
    /** Those classes would be stripped by PostCSS PurgeCSS otherwise */
    @apply t-border-l-4 t-list-decimal
  }

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

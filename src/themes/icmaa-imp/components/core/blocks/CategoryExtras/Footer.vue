<template>
  <div
    v-if="isVisible && (description || footerContent || footerDescription)"
    class="category-footer"
  >
    <div
      v-if="description || footerContent"
      class="t-mb-8 t-px-4 md:t-mb-0"
    >
      <h2
        v-if="categoryExtras.title"
        class="t-any category-footer__headline"
        v-text="categoryExtras.title"
      />
      <component
        :is="descriptionComponent"
        v-if="description"
        class="category-footer__description"
      />
      <BlockWrapper
        v-if="footerContent"
        class="category-footer__description"
        :components="footerContent"
      />
    </div>
    <div
      v-if="footerDescription"
      class="t-mt-8 t-text-xs t-leading-snug t-text-base-lighter"
    >
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

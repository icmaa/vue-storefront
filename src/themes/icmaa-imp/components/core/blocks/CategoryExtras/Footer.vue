<template>
  <div class="t-flex t-flex-wrap t--mx-4 t-px-4" v-if="isVisible && (description || footerDescription)">
    <div class="t-w-full t-mb-8 md:t-mb-0 t-px-4" v-if="description">
      <h2 class="t-flex t-items-center t-h-10 t-text-1xl t-text-base-dark t-font-thin t-leading-1-em t-mb-4">
        {{ categoryExtras.title }}
      </h2>
      <p class="t-text-base-tone t-text-sm t-leading-snug" :class="{ 't-h-40 t-overflow-hidden t-fade-out-text': descriptionFolded }" v-html="description" />
      <div class="t-text-center t-text-base-light t-text-sm t-leading-1em t-mt-4 t-cursor-pointer" v-if="isLongDescription" @click="descriptionFolded = !descriptionFolded">
        <material-icon :icon="descriptionFolded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" size="xs" class="t-align-middle" />
        {{ descriptionFolded ? $t('Read more') : $t('Read less') }}
      </div>
    </div>
    <div class="t-w-full t-px-4 t-mt-8 t-text-xs t-text-base-lighter t-leading-snug" v-if="footerDescription">
      {{ footerDescription }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { stripHTML } from '@vue-storefront/core/filters'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'CategoryExtrasFooter',
  components: {
    MaterialIcon
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
    isLongDescription () {
      return !!this.foldDescription && (stripHTML(this.description).length > 500)
    },
    footerDescription () {
      // This is the disclaimer text below the footer / weird attribute title
      return this.categoryExtras.descriptionFooter || false
    }
  },
  created () {
    if (this.isLongDescription) {
      this.descriptionFolded = true
    }
  }
}
</script>

<style lang="scss">

.t-fade-out-text {
  background: -webkit-linear-gradient(top, #000 50%, transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  * {
    font-size: inherit !important;
    font-weight: inherit !important;
    @apply t-inline t-text-left t-text-sm t-text-base-tone t-font-normal;
  }
  br { @apply t-hidden; }
  a { @apply t-static; }
}

</style>

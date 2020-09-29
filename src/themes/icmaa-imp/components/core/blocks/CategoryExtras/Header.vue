<template>
  <div v-if="isVisible">
    <div class="category-header t-relative" :class="{ 'loaded': !bannerLoading }">
      <picture-component :src="banner" :width="bannerWidth" :height="bannerHeight" :sizes="bannerSizes" :placeholder="true" :ratio="`${bannerWidth}:${bannerHeight}`" :auto-reload="true" @load="onBannerLoad" @error="onBannerError" :alt="category.name" v-if="banner" img-class="t-w-screen" placeholder-class="t-w-screen lg:t-w-auto" />
      <div class="t-flex t-items-center t-justify-end t-absolute t-bottom-0 t-left-0 t-pb-6 t-px-6 t-w-full">
        <slot />
      </div>
    </div>
    <div class="t-px-4 t-py-2 t-flex t-justify-between" v-if="spotifyLogoItems && spotifyLogoItems.length > 0">
      <span class="t-flex-fix t-hidden xl:t-inline-block t-flex t-self-center t-text-base-light t-text-sm t-mr-8">{{ $t('Similar bands:') }}</span>
      <department-logo v-for="(logo, index) in spotifyLogoItems" :key="index" v-bind="logo.data()" class="t-flex-fix t-opacity-60 hover:t-opacity-100" :class="{ 't-mr-4': isLast(index, spotifyLogoItems)}" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import DepartmentLogo from 'theme/components/core/blocks/CategoryExtras/DepartmentLogo'
import PictureComponent from 'theme/components/core/blocks/Picture'

import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'
import sampleSize from 'lodash-es/sampleSize'

export default {
  name: 'CategoryExtrasHeader',
  components: {
    DepartmentLogo,
    PictureComponent
  },
  props: {
    bannerDimensions: {
      type: [Object],
      default: () => ({
        default: { width: 780, height: 240 },
        fallback: { width: 1140, height: 240 }
      })
    },
    bannerSizes: {
      type: [Array],
      default: () => [
        // Order high-to-low is important
        { media: '(min-width: 1280px)', width: 1280 },
        { media: '(min-width: 1024px)', width: 992 },
        { media: '(min-width: 640px)', width: 736 },
        { media: '(min-width: 415px)', width: 640 },
        { media: '(max-width: 415px)', width: 415 }
      ]
    },
    spotifyLogoLimit: {
      type: [Boolean, Number],
      default: false
    }
  },
  data () {
    return {
      bannerLoading: true,
      bannerExists: true
    }
  },
  computed: {
    ...mapGetters({
      category: 'icmaaCategoryExtras/getCurrentCategory',
      categoryExtras: 'icmaaCategoryExtras/getCategoryExtrasByCurrentCategory',
      getSpotifyLogoItems: 'icmaaCategoryExtras/getSpotifyLogolineItemsByCurrentCategory',
      viewport: 'ui/getViewport'
    }),
    isVisible () {
      if (!this.categoryExtras) {
        return false
      }

      const { bannerShowFrom, bannerShowTo, active } = this.categoryExtras
      return active && (this.banner || this.spotifyLogoItems.length > 0) &&
        isDatetimeInBetween(bannerShowFrom, bannerShowTo)
    },
    banner () {
      if (!this.categoryExtras.bannerImage) {
        return false
      }

      let banner = this.categoryExtras.bannerImage
      if (!this.bannerExists) {
        banner = this.categoryExtras.bannerImage.replace('_mobile', '')
      }

      return banner
    },
    bannerWidth () {
      return this.bannerExists ? this.bannerDimensions.default.width : this.bannerDimensions.fallback.width
    },
    bannerHeight () {
      return this.bannerExists ? this.bannerDimensions.default.height : this.bannerDimensions.fallback.height
    },
    spotifyLogoItems () {
      return Object.values(this.getSpotifyLogoItems).slice(0, this.spotifyLogoLimit || this.logoLimitByViewport())
    }
  },
  methods: {
    isLast (index, array) {
      return index !== (array.length - 1)
    },
    onBannerLoad () {
      this.bannerLoading = false
    },
    onBannerError () {
      this.bannerLoading = true
      this.bannerExists = false
    },
    logoLimitByViewport () {
      const viewportLimits = { xs: 4, sm: 4, md: 7, lg: 7, xl: 10 }
      return viewportLimits[this.viewport] || 4;
    }
  }
}
</script>

<template>
  <div v-if="isVisible">
    <div
      :class="{ 'loaded': !bannerLoading }"
      class="category-header t-relative"
    >
      <PictureComponent
        v-if="banner"
        :src="banner"
        :width="bannerWidth"
        :height="bannerHeight"
        :sizes="bannerSizes"
        :placeholder="true"
        :ratio="`${bannerWidth}:${bannerHeight}`"
        :auto-reload="true"
        :preload-in-header="true"
        :alt="category.name"
        :class="{ 't-cursor-pointer': linkedBanner }"
        img-class="t-w-screen"
        placeholder-class="t-w-screen lg:t-w-auto"
        @load="onBannerLoad"
        @error="onBannerError"
        @click="goToCategory()"
      />
      <div
        v-if="!!$slots.default"
        class="t-absolute t-bottom-0 t-left-0 t-flex t-w-full t-items-center t-justify-end t-px-6 t-pb-6"
      >
        <slot />
      </div>
    </div>
    <div
      v-if="(showRelatedCategories && (!relatedCategoryLogosLoaded || logoItems.length > 0)) || (isSpotifyCategory && (!isSpotifyLoaded || logoItems.length > 0))"
      class="t-px-4 t-py-2"
    >
      <div
        class="t-flex t-justify-between"
        style="height: 38px;"
      >
        <span class="t-mr-8 t-hidden t-flex-fix t-self-center t-text-sm t-text-base-light xl:t-inline-block">{{ isSpotifyCategory ? $t('Similar bands:') : $t('Similar brands:') }}</span>
        <DepartmentLogo
          v-for="(logo, index) in logoItems"
          :key="index"
          v-bind="logo.data()"
          :class="{ 't-mr-4': isLast(index, logoItems)}"
          class="t-flex-fix t-opacity-60 hover:t-opacity-100"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'
import PictureComponent from 'theme/components/core/blocks/Picture'
import DepartmentLogo from 'theme/components/core/blocks/CategoryExtras/DepartmentLogo'

export default {
  name: 'CategoryExtrasHeader',
  components: {
    PictureComponent,
    DepartmentLogo
  },
  props: {
    linkedBanner: {
      type: Boolean,
      default: false
    },
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
        { media: 'xl', width: 1280 },
        { media: 'lg', width: 992 },
        { media: 'sm', width: 736 },
        { media: 'xs', width: 640 },
        { width: 415 }
      ]
    },
    logoLimit: {
      type: [Boolean, Number],
      default: false
    }
  },
  data () {
    return {
      bannerLoading: true,
      bannerExists: true,
      relatedCategoryLogos: [],
      relatedCategoryLogosLoaded: false
    }
  },
  computed: {
    ...mapGetters({
      category: 'icmaaCategoryExtras/getCurrentCategory',
      categoryExtras: 'icmaaCategoryExtras/getCategoryExtrasByCurrentCategory',
      relatedParentCategoryId: 'icmaaCategoryExtras/getRelatedParentCategoryIdFromTree',
      getLogolineItems: 'icmaaCategoryExtras/getLogolineItems',
      getSpotifyLogoItems: 'icmaaCategoryExtras/getSpotifyLogolineItemsByCurrentCategory',
      isSpotifyLoaded: 'icmaaSpotify/areCurrentRelatedCategoriesLoaded',
      showRelatedCategories: 'icmaaCategoryExtras/showRelatedCategoriesFromTree',
      isInSpotifyCategoryAllowList: 'icmaaSpotify/isInCategoryAllowList',
      viewport: 'ui/getViewport'
    }),
    isVisible () {
      if (!this.categoryExtras) {
        return false
      }

      const { bannerShowFrom, bannerShowTo, active } = this.categoryExtras
      return active && this.banner && isDatetimeInBetween(bannerShowFrom, bannerShowTo)
    },
    banner () {
      if (!this.categoryExtras.bannerImage) {
        return false
      }

      let banner = this.categoryExtras.bannerImage
      if (!this.bannerExists) {
        banner = this.categoryExtras.bannerImage.replace('_mobile', '_desktop')
      }

      return banner
    },
    bannerWidth () {
      return this.bannerExists ? this.bannerDimensions.default.width : this.bannerDimensions.fallback.width
    },
    bannerHeight () {
      return this.bannerExists ? this.bannerDimensions.default.height : this.bannerDimensions.fallback.height
    },
    isSpotifyCategory () {
      return this.isInSpotifyCategoryAllowList(this.category)
    },
    logoItems () {
      const items = this.isSpotifyCategory ? this.getSpotifyLogoItems : this.relatedCategoryLogos
      return Object.values(items).slice(0, this.logoLimit || this.logoLimitByViewport)
    },
    logoLimitByViewport () {
      const viewportLimits = { xs: 4, sm: 4, md: 7, lg: 7, xl: 10 }
      return viewportLimits[this.viewport] || 4
    }
  },
  watch: {
    'category.id' () {
      this.loadRelatedCategoryLogos()
    }
  },
  mounted () {
    this.loadRelatedCategoryLogos()
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
    goToCategory () {
      if (this.linkedBanner) {
        this.$router.push(formatCategoryLink(this.category))
      }
    },
    async loadRelatedCategoryLogos () {
      if (!this.showRelatedCategories) return

      const filters = {
        'path': this.relatedParentCategoryId,
        'ceHasLogo': true,
        'ceLogoline': true,
        'id': { 'neq': this.category.id }
      }

      // Add custom random sort, rather than build in as the results are not the same
      const sort = {
        field: '_script',
        options: {
          script: 'Math.random()',
          type: 'number',
          order: 'asc'
        }
      }

      const fetchedCategories = await this.$store.dispatch(
        'category-next/loadCategories',
        { filters, size: this.limit, onlyActive: true, sort, ignoreNotFoundCategories: true }
      )

      this.relatedCategoryLogos = this.getLogolineItems(fetchedCategories)
      this.relatedCategoryLogosLoaded = true
    }
  }
}
</script>

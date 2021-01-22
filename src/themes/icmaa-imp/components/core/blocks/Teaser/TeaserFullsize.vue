<template>
  <div data-test-id="TeaserFullsize" class="teaser-fullsize t-mx-0 sm:t-mx-4 t-cursor-pointer t-webkit-tap-transparent" @click="redirect" @mouseover="onHover" @mouseleave="onHover">
    <div class="t-relative">
      <picture-component :alt="teaser.text1 | translate | htmlDecode" :src="imageUrl" :width="size.width" :height="size.height" :placeholder="true" :sizes="sizes" :ratio="ratio" class="t-w-full" />
      <h2 class="t-absolute t-bottom-0 t-inset-x-0 t-mb-6 t-text-sm t-text-small t-uppercase">
        <router-link :to="link" @click.native="setGender" :title="teaser.text1 | translate | htmlDecode" class="t-flex t-justify-center t-items-center" :class="{ 't-text-white': !textColor }" :style="{ color: textColor }">
          {{ teaser.text1 | translate }}
          <material-icon icon="arrow_forward" size="sm" class="t-ml-2" />
        </router-link>
      </h2>
      <edit-button :edit-url="editUrl" class="t-left-0 t--ml-2 t--mt-2" :class="{ 't-hidden': !hover }" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import TeaserMixin from 'icmaa-teaser/mixins/teaserMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import PictureComponent from 'theme/components/core/blocks/Picture'
import EditButton from 'theme/components/core/blocks/Teaser/EditButton'

export default {
  name: 'TeaserFullsize',
  mixins: [ TeaserMixin ],
  components: {
    MaterialIcon,
    PictureComponent,
    EditButton
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport'
    }),
    isMobile () {
      return ['xs', 'sm'].includes(this.viewport)
    },
    sizes () {
      return [
        // Order high-to-low is important
        { media: '(min-width: 1280px)', width: 1248, src: this.teaser.imageUrlDesktop },
        { media: '(min-width: 1024px)', width: 992, src: this.teaser.imageUrlDesktop },
        { media: '(min-width: 640px)', width: 768, src: this.teaser.imageUrlDesktop },
        { media: '(min-width: 415px)', width: 640 },
        { media: '(max-width: 415px)', width: 415 }
      ]
    },
    imageUrl () {
      if (!this.isMobile) {
        return this.teaser.imageUrlDesktop ? this.teaser.imageUrlDesktop : this.teaser.imageUrl
      }
      return this.teaser.imageUrl
    },
    size () {
      if (!this.isMobile) {
        return { width: 1248, height: 624 }
      }
      return { width: 624, height: 624 }
    },
    ratio () {
      if (!this.isMobile) {
        return '2:1'
      }
      return '1:1'
    }
  }
}
</script>

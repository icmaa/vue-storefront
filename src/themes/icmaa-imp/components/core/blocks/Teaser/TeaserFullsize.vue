<template>
  <div
    data-test-id="TeaserFullsize"
    class="teaser-fullsize t-mx-4 t-cursor-pointer t-webkit-tap-transparent"
    @click="redirect"
    @mouseover="onHover"
    @mouseleave="onHover"
  >
    <div class="t-relative">
      <PictureComponent
        :alt="teaser.text1 | htmlDecode"
        :src="imageUrl"
        :width="size.width"
        :height="size.height"
        :placeholder="true"
        :sizes="sizes"
        :ratio="ratio"
        class="t-w-full"
      />
      <h2 class="t-text-small t-absolute t-inset-x-0 t-bottom-0 t-mb-6 t-text-sm t-uppercase">
        <router-link
          :to="link"
          :title="teaser.text1 | htmlDecode"
          class="t-flex t-items-center t-justify-center"
          :class="{ 't-text-white': !textColor }"
          :style="{ color: textColor }"
          @click.native="setGender"
        >
          {{ teaser.text1 }}
          <MaterialIcon
            icon="arrow_forward"
            size="sm"
            class="t-ml-2"
          />
        </router-link>
      </h2>
      <EditButton
        :edit-url="editUrl"
        class="t-left-0 t--ml-2 t--mt-2"
        :class="{ 't-hidden': !hover }"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TeaserMixin from 'icmaa-teaser/mixins/teaserMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import PictureComponent from 'theme/components/core/blocks/Picture'
import EditButton from 'theme/components/core/blocks/Teaser/EditButton'

export default {
  name: 'TeaserFullsize',
  components: {
    MaterialIcon,
    PictureComponent,
    EditButton
  },
  mixins: [ TeaserMixin ],
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
        { media: 'xl', width: 1248, src: this.teaser.imageUrlDesktop },
        { media: 'lg', width: 992, src: this.teaser.imageUrlDesktop },
        { media: 'md', width: 768, src: this.teaser.imageUrlDesktop },
        { media: 'xs', width: 640 },
        { width: 415 }
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

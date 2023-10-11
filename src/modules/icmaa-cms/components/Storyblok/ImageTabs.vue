<template>
  <div>
    <div
      class="t-flex t-w-full t-flex-col t-items-center t-overflow-scroll t-hide-scrollbar t-scrolling-touch"
      :class="[ tabBackgroundStyle ]"
    >
      <div
        class="t-flex t-items-center t-p-4 t-px-2"
      >
        <div
          v-for="(image, i) in images"
          :key="'tab-' + i"
          class="t-cursor-pointer t-px-2 t-text-sm t-font-light t-uppercase lg:t-px-4"
          :class="[ tabTextStyle, { 't-font-normal t-underline t-underline-offset-8': current === i } ]"
          @click="current = i"
        >
          {{ image.title }}
        </div>
      </div>
    </div>
    <div class="images t-overflow-hidden">
      <div
        class="scroller t-flex"
        :style="{'--index': current }"
      >
        <div
          v-for="(img, i) in images"
          :key="'image-' + i"
          class="t-flex-full"
        >
          <router-link
            :to="localizedRoute(img.link)"
          >
            <PictureComponent
              :key="img.src"
              :src="img.src"
              :width="size.width"
              :height="size.height"
              :sizes="getSizes(img.srcMobile)"
              :placeholder="true"
              :preload-in-header="true"
              :preload-in-header-prefix="'image-tab-' + i + '-'"
              :ratio="`${size.width}:${size.height}`"
              :alt="img.title | htmlDecode"
            />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PictureComponent from 'theme/components/core/blocks/Picture'

export default {
  name: 'ImageTabsComponent',
  components: {
    PictureComponent
  },
  props: {
    images: {
      type: Array,
      required: true
    },
    tabTextStyle: {
      type: String,
      default: 't-text-white'
    },
    tabBackgroundStyle: {
      type: String,
      default: 't-bg-primary'
    }
  },
  data () {
    return {
      current: 0
    }
  },
  computed: {
    ...mapGetters({ viewport: 'ui/getViewport' }),
    size () {
      if (['xs', 'sm', 'md'].includes(this.viewport)) {
        return { width: 768, height: 768 }
      }
      return { width: 1248, height: 755 }
    },
    sizes () {
      return [
        { media: 'xl', width: 1248 },
        { media: 'lg', width: 1024 },
        { media: 'md', width: 768 },
        { width: 425 }
      ]
    }
  },
  methods: {
    getSizes (mobileImage) {
      return this.sizes.map(s => {
        if ((!s?.media || s?.media === 'md') && mobileImage) {
          s.src = mobileImage
        }
        return s
      })
    }
  }
}
</script>

<style lang="scss">
.scroller {
  transform: translateX(calc(var(--index) * -100%));
  transition: transform 300ms ease-in-out;
}
</style>

<template>
  <div class="product-gallery t-overflow-hidden t-relative">
    <img src="/assets/product-placeholder.svg" class="t-block t-w-full lg:t-w-2/3" v-if="!isOnline">
    <template v-else>
      <div
        class="t-hidden lg:t-flex t-absolute t-right-0 t-top-1/2 t-z-1 t--mt-6 t-items-center t-justify-center t-w-12 t-h-12 t-bg-black t-text-white t-rounded-full t-border t-border-white t-cursor-pointer t-mr-4"
        v-if="imagesCount > 0 && currentIndex < imagesCount"
        @click="step(+1)"
      >
        <i class="material-icons t-text-2xl">keyboard_arrow_right</i>
      </div>
      <div
        class="t-hidden lg:t-flex t-absolute t-left-0 t-top-1/2 t-z-1 t--mt-6 t-items-center t-justify-center t-w-12 t-h-12 t-bg-black t-text-white t-rounded-full t-border t-border-white t-cursor-pointer t-ml-4"
        v-if="imagesCount > 0 && currentIndex > 1"
        @click="step(-1)"
      >
        <i class="material-icons t-text-2xl">keyboard_arrow_left</i>
      </div>
      <div
        class="media-gallery t-flex t-items-center t-overflow-hidden"
        :class="{ 'animate': animate }"
        :style="{ '--n': imagesCount, '--i': drag }"
        ref="track"
        @touchstart="onTouchStart"
        @touchmove="onTouch"
        @touchend="onTouchEnd"
      >
        <product-image v-for="image in images" :key="image" :image="image" :alt="product.name | htmlDecode" />
      </div>
    </template>
  </div>
</template>

<script>
import { onlineHelper } from '@vue-storefront/core/helpers'
import ProductImage from 'theme/components/core/ProductImage'

export default {
  components: {
    ProductImage
  },
  props: {
    gallery: {
      type: Array,
      required: true
    },
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      animate: true,
      currentIndex: 1,
      dragLock: 0,
      drag: 1
    }
  },
  computed: {
    images () {
      return this.gallery.filter(image => {
        /** Filter out old _sm files, they are duplicates of large ones */
        const regex = /(_sm)(_\w*)*(\.[a-zA-Z]{3,4})$/gm
        return regex.exec(image) === null
      })
    },
    imagesCount () {
      return this.images.length
    },
    isOnline () {
      return onlineHelper.isOnline
    }
  },
  methods: {
    setIndex (index) {
      if (index >= 1 && index <= this.imagesCount) {
        this.drag = index
        this.currentIndex = index
      }
    },
    step (index) {
      this.setIndex(this.currentIndex + index)
    },
    onTouchStart (e) {
      this.animate = false
      this.dragLock = e.touches[0].clientX
    },
    onTouch (e) {
      const drag = e.touches[0].clientX - this.dragLock
      const imageWidth = this.getImageWidth()
      this.drag = this.currentIndex - (drag / imageWidth)
    },
    onTouchEnd (e) {
      const drag = this.drag
      const direction = this.drag > this.currentIndex ? -1 : 1
      const nextIndex = this.currentIndex - direction

      this.animate = true
      this.dragLock = 0
      this.drag = this.currentIndex

      if (Math.abs(drag - this.currentIndex) > 0.2) {
        this.setIndex(nextIndex)
      }
    },
    getImageWidth () {
      return this.$refs.track.querySelector('img').clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>

/**
 * This is a custom approach by using CSS and JS in combination with standard browser funcs.
 * @see https://css-tricks.com/simple-swipe-with-vanilla-javascript/
 */
.product-gallery {
  --image-width: 100%;

  @media (min-width: 1024px) {
    isolation: isolate;
    background: -moz-linear-gradient(left,  rgba(0,0,0,0) 1%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.05) 90%, rgba(0,0,0,0.1) 98%, rgba(0,0,0,0.1) 99%, rgba(0,0,0,0.15) 100%);
    background: -webkit-linear-gradient(left,  rgba(0,0,0,0) 1%,rgba(0,0,0,0) 75%,rgba(0,0,0,0.05) 90%,rgba(0,0,0,0.1) 98%,rgba(0,0,0,0.1) 99%,rgba(0,0,0,0.15) 100%);
    background: linear-gradient(to right,  rgba(0,0,0,0) 1%,rgba(0,0,0,0) 75%,rgba(0,0,0,0.05) 90%,rgba(0,0,0,0.1) 98%,rgba(0,0,0,0.1) 99%,rgba(0,0,0,0.15) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#26000000',GradientType=1 );

    .media-gallery {
      mix-blend-mode: multiply;
    }

    --image-width: 75%;
  }

  .media-gallery {
    --n: 1;

    width: 100%;
    width: calc(var(--n) * 100%);
    transform: translate(calc((var(--i, 1) - 1) / var(--n) * (-1 * var(--image-width))));

    &.animate {
      transition: transform .5s ease-out;
    }

    picture {
      min-width: var(--image-width);
      width: var(--image-width);
      min-width: calc(var(--image-width) / var(--n));
      width: calc(var(--image-width) / var(--n));
    }
  }

  .loading-placeholder {
    height: 140vw;

    @media only screen and (min-width:1024px) {
      width: var(--image-width);
      height: 66.6%;
    }
  }
}
</style>

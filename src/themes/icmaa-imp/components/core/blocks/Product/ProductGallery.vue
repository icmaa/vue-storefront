<template>
  <div class="product-gallery t-overflow-hidden t-relative">
    <img src="/assets/product-placeholder.svg" class="t-block t-w-full lg:t-w-2/3" v-if="!isOnline">
    <template v-else>
      <div class="debug t-bg-white t-p-2 t-absolute t-z-1 t-bottom-0 t-right-0">
        {{ debug }}
      </div>
      <template v-if="!zoom && imagesCount > 0">
        <div
          :class="[ 't-right-0', controlsClass ]"
          v-if="currentIndex < imagesCount"
          @click="step(+1)"
        >
          <i class="material-icons t-text-2xl">keyboard_arrow_right</i>
        </div>
        <div
          :class="[ 't-left-0', controlsClass ]"
          v-if="currentIndex > 1"
          @click="step(-1)"
        >
          <i class="material-icons t-text-2xl">keyboard_arrow_left</i>
        </div>
      </template>
      <!--div
        class="t-absolute t-bottom-0 t-right-0 t-z-1 t-p-4 t-bg-white t-cursor-pointer"
      >
        <i class="material-icons t-text-4xl t-text-base-lighter" v-text="zoom ? 'zoom_out' : 'zoom_in'" />
      </div-->
      <div
        ref="zoom"
        class="zoom"
        :class="{ 'animate': animate, 't-cursor-zoom-in': !zoom, 't-cursor-move enabled': zoom }"
        :style="{ '--z': zoomFactor, '--zx': `${zoomPosition.x}px`, '--zy': `${zoomPosition.y}px` }"
        @mousedown="initMouseZoom"
      >
        <div
          ref="track"
          class="media-gallery t-flex t-items-center t-overflow-hidden"
          :class="{ 'animate': animate }"
          :style="{ '--n': imagesCount, '--i': dragX }"
          @touchstart="onTouchStart"
          @touchmove="onTouch"
          @touchend="onTouchEnd"
        >
          <product-image v-for="image in images" :key="image" :image="image" :alt="product.name | htmlDecode" :sizes="sizes" @dragstart.prevent />
        </div>
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
    },
    controlsClass: {
      type: String,
      default: 't-hidden lg:t-flex t-absolute t-top-1/2 t-z-1 t--mt-6 t-items-center t-justify-center t-w-12 t-h-12 t-bg-black t-text-white t-rounded-full t-border t-border-white t-cursor-pointer t-mx-4'
    }
  },
  data () {
    return {
      animate: true,
      currentIndex: 1,
      drag: true,
      dragLock: 0,
      dragX: 1,
      zoom: false,
      zoomFactor: 1,
      zoomRect: {},
      zoomPosition: { x: 0, y: 0 },
      debug: []
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
    sizes () {
      return [
        // Order high-to-low is important
        { media: '(min-width: 1024px)', width: 330 },
        { media: '(max-width: 1024px)', width: 768 },
        { media: '(max-width: 500px)', width: 500 },
        { media: '(max-width: 414px)', width: 414 }
      ]
    },
    isOnline () {
      return onlineHelper.isOnline
    }
  },
  methods: {
    setIndex (index) {
      if (index >= 1 && index <= this.imagesCount) {
        this.dragX = index
        this.currentIndex = index
      }
    },
    step (index) {
      this.setIndex(this.currentIndex + index)
    },
    onTouchStart (e) {
      if (!this.drag) return
      this.animate = false
      this.dragLock = this.universalTouch(e).clientX
    },
    onTouch (e) {
      if (!this.drag) return
      const drag = this.universalTouch(e).clientX - this.dragLock
      const imageWidth = this.getImageWidth()
      this.dragX = this.currentIndex - (drag / imageWidth)
    },
    onTouchEnd () {
      if (!this.drag) return
      const drag = this.dragX
      const direction = this.dragX > this.currentIndex ? -1 : 1
      const nextIndex = this.currentIndex - direction

      this.animate = true
      this.dragLock = 0
      this.dragX = this.currentIndex

      if (Math.abs(drag - this.currentIndex) > 0.15) {
        this.setIndex(nextIndex)
      }
    },
    initMouseZoom (e) {
      this.enableZoom(e)
      this.$refs.zoom.addEventListener('mousemove', this.onMouseZoomMove)

      const cancelEvent = (e) => {
        this.disableZoom(e)
        this.$refs.zoom.removeEventListener('mousemove', this.onZoomMove)
        this.$refs.zoom.removeEventListener(e.type, cancelEvent)
      }

      this.$refs.zoom.addEventListener('mouseup', cancelEvent)
      this.$refs.zoom.addEventListener('mouseleave', cancelEvent)
      this.$refs.zoom.addEventListener('mousechancel', cancelEvent)
    },
    enableZoom (e) {
      this.drag = false
      this.zoom = true

      const scale = 4
      this.setZoomRect(scale)
      this.onMouseZoomMove(e)

      this.zoomFactor = scale
      setTimeout(() => {
        this.animate = false
      }, 250)
    },
    disableZoom (e) {
      this.drag = true
      this.animate = true
      this.zoom = false
      this.zoomFactor = 1
      this.zoomPosition = { x: 0, y: 0 }
      this.zoomRect = {}
    },
    onMouseZoomMove (e) {
      if (!this.zoom) {
        return
      }

      const { bx, by, bw, bh, w, h, zeroX, zeroY } = this.zoomRect

      const cx = this.universalTouch(e).clientX
      const cy = this.universalTouch(e).clientY
      const rcx = cx - bx
      const rcy = cy - by

      this.debug = [ cx, cy, rcx, rcy, (rcx / bw), (rcy / bh) ]

      this.zoomPosition = {
        x: zeroX - (rcx / bw * w),
        y: zeroY - (rcy / bh * h)
      }
    },
    universalTouch (e) {
      switch (e.type) {
        case 'touchend':
          return e.changedTouches[0]
        case 'touchstart':
        case 'touchmove':
          return e.touches[0]
        default:
          return e
      }
    },
    getImageWidth () {
      return this.$refs.track.querySelector('img').clientWidth
    },
    setZoomRect (zoomFactor = 1) {
      const baseRect = this.$refs.zoom.getBoundingClientRect()
      const { width: bw, height: bh, top: by, left: bx } = baseRect

      const rect = {
        w: bw * zoomFactor,
        h: bh * zoomFactor
      }

      rect.x = bx - (rect.w / 2) + (bw / 2)
      rect.y = by - (rect.h / 2) + (bh / 2)

      const zero = {
        zeroX: rect.x * -1 + bx,
        zeroY: rect.y * -1 + by
      }

      this.zoomRect = {
        ...{ bw, bh, bx, by },
        ...rect,
        ...zero
      }
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

  .zoom {
    transform: translate(var(--zx, 0), var(--zy, 0)) scale(var(--z, 1));

    &.animate {
      transition: transform .25s ease-out;
    }

    &.enabled {
      touch-action: none;
    }
  }

  @media (min-width: 1024px) {
    isolation: isolate;
    background: -moz-linear-gradient(left,  rgba(0,0,0,0) 1%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.05) 90%, rgba(0,0,0,0.1) 98%, rgba(0,0,0,0.1) 99%, rgba(0,0,0,0.15) 100%);
    background: -webkit-linear-gradient(left,  rgba(0,0,0,0) 1%,rgba(0,0,0,0) 75%,rgba(0,0,0,0.05) 90%,rgba(0,0,0,0.1) 98%,rgba(0,0,0,0.1) 99%,rgba(0,0,0,0.15) 100%);
    background: linear-gradient(to right,  rgba(0,0,0,0) 1%,rgba(0,0,0,0) 75%,rgba(0,0,0,0.05) 90%,rgba(0,0,0,0.1) 98%,rgba(0,0,0,0.1) 99%,rgba(0,0,0,0.15) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#26000000',GradientType=1 );

    .media-gallery {
      mix-blend-mode: multiply;
    }

    --image-width: 90%;
  }

  @media (min-width: 1280px) {
    --image-width: 75%;
  }

  .media-gallery {
    --n: 1;

    width: 100%;
    width: calc(var(--n) * 100%);
    transform: translate(calc((var(--i, 1) - 1) / var(--n) * (-1 * var(--image-width))));
    touch-action: pan-y;

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

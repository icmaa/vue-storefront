<template>
  <div class="product-gallery t-overflow-hidden t-relative">
    <img src="/assets/product-placeholder.svg" class="t-block t-w-full lg:t-w-2/3" v-if="!isOnline">
    <template v-else>
      <div
        ref="zoom"
        class="zoom"
        :class="{ 'animate': animate, 't-cursor-zoom-in': !zoom, 't-cursor-move enabled': zoom }"
        :style="{ '--z': currentZoomFactor, '--zx': `${zoomPosition.x}px`, '--zy': `${zoomPosition.y}px` }"
        @click="onZoomClick"
        @mousemove="onMouseZoomMove"
        @mouseleave="onMouseZoomChancel"
        @mousechancel="onMouseZoomChancel"
        @doubletab="initTouchZoom"
        @touchstart="onTouchZoomStart"
        @touchmove="onTouchZoomMove"
      >
        <div
          ref="track"
          class="media-gallery t-flex t-items-center t-overflow-hidden"
          :class="{ 'animate': animate }"
          :style="{ '--n': imagesCount, '--i': dragX }"
          @touchstart="swipeStart"
          @touchmove="swipe"
          @touchend="swipeEnd"
          @touchchancel="swipeEnd"
        >
          <product-image
            v-for="(image, i) in images"
            :key="'zoom-' + product.sku + '-' + i"
            :image="image"
            :alt="product.name | htmlDecode"
            :sizes="sizes"
            :type="zoom ? 'fullsize' : 'gallery'"
            :enable-auto-reload="true"
            :width="468"
            :height="676"
            @dragstart.prevent
            @dragover.prevent
          />
        </div>
      </div>
      <template v-if="!zoom && imagesCount > 1">
        <div
          class="t-hidden lg:t-flex t-absolute t-top-1/2 t-right-0 t-z-1 t--mt-6 t-items-center t-justify-center t-w-12 t-h-12 t-bg-black t-text-white t-rounded-full t-border t-border-white t-cursor-pointer t-mx-4"
          v-show="index < imagesCount"
          @click="step(+1)"
        >
          <i class="material-icons t-text-2xl">keyboard_arrow_right</i>
        </div>
        <div
          class="t-hidden lg:t-flex t-absolute t-top-1/2 t-left-0 t-z-1 t--mt-6 t-items-center t-justify-center t-w-12 t-h-12 t-bg-black t-text-white t-rounded-full t-border t-border-white t-cursor-pointer t-mx-4"
          v-show="index > 1"
          @click="step(-1)"
        >
          <i class="material-icons t-text-2xl">keyboard_arrow_left</i>
        </div>
      </template>
      <div
        class="lg:t-hidden t-absolute t-bottom-0 t-right-0 t-z-1 t-p-2 t-bg-white t-rounded-full t-flex t-mb-2 t-mr-2 t-cursor-pointer"
        @click="initTouchZoom"
      >
        <i class="material-icons t-text-4xl t-text-base-lighter" v-text="zoom ? 'zoom_out' : 'zoom_in'" />
      </div>
      <div
        class="lg:t-hidden t-absolute t-left-0 t-bottom-0 t-z-1 t-ml-4 t-mb-4 t-px-2 t-py-1 t-bg-white t-text-base-light t-text-sm"
        v-if="imagesCount > 1 && !zoom"
      >
        {{ index }} / {{ imagesCount }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { onlineHelper } from '@vue-storefront/core/helpers'
import { setCleanTimeout } from 'icmaa-config/helpers/cleanTimeout'
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
    zoomFactor: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      animate: true,
      index: 1,
      drag: true,
      dragLock: 0,
      dragX: 1,
      zoom: false,
      zoomRect: {},
      zoomPosition: { x: 0, y: 0 },
      isDoubleTab: false,
      currentZoomFactor: 1,
      touchZoomLock: { cx: 0, cy: 0, x: 0, y: 0 }
    }
  },
  computed: {
    ...mapGetters({
      isTouchDevice: 'ui/isTouchDevice'
    }),
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
        { media: '(min-width: 1024px)', width: 500 * this.currentZoomFactor },
        { media: '(max-width: 1024px)', width: 768 * this.currentZoomFactor },
        { media: '(max-width: 500px)', width: 500 * this.currentZoomFactor },
        { media: '(max-width: 414px)', width: 414 * this.currentZoomFactor }
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
        this.index = index
      }
    },
    step (index) {
      this.setIndex(this.index + index)
    },
    swipeStart (e) {
      if (!this.drag) return
      this.animate = false
      this.dragLock = this.universalTouch(e).clientX
    },
    swipe (e) {
      if (!this.drag) return
      const drag = this.universalTouch(e).clientX - this.dragLock
      const imageWidth = this.getImageWidth()
      this.dragX = this.index - (drag / imageWidth)
    },
    swipeEnd () {
      if (!this.drag) return
      const drag = this.dragX
      const direction = this.dragX > this.index ? -1 : 1
      const nextIndex = this.index - direction

      this.animate = true
      this.dragLock = 0
      this.dragX = this.index

      if (Math.abs(drag - this.index) > 0.15) {
        this.setIndex(nextIndex)
      }
    },
    onZoomClick (e) {
      if (!this.isTouchDevice) {
        if (!this.zoom) {
          this.enableZoom(e)
        } else {
          this.onMouseZoomChancel(e)
        }
      } else {
        this.bindTouchZoomDoubleTab(e)
      }
    },
    onMouseZoomMove (e, force = false) {
      if (!force && (this.isTouchDevice || !this.zoom)) return

      const { bw, bh, w, h, zeroX, zeroY } = this.zoomRect
      const { clientX: cx, clientY: cy } = this.universalTouch(e)
      const { pcx, pcy } = this.getRelativeCursorPosition(cx, cy)

      this.zoomPosition = {
        x: zeroX - (pcx * (w - bw)),
        y: zeroY - (pcy * (h - bh))
      }
    },
    onMouseZoomChancel (e) {
      if (this.isTouchDevice) return

      if (this.zoom) {
        this.disableZoom(e)
      }
    },
    initTouchZoom (e) {
      if (!this.zoom) {
        this.enableZoom(e, true)
      } else {
        this.disableZoom(e)
      }
    },
    onTouchZoomStart (e) {
      if (!this.zoom || !this.isTouchDevice) return

      const { clientX: cx, clientY: cy } = this.universalTouch(e)
      this.touchZoomLock = { cx, cy, ...this.zoomPosition }
    },
    onTouchZoomMove (e) {
      if (!this.zoom || !this.isTouchDevice) return

      const { clientX: cx, clientY: cy } = this.universalTouch(e)
      const { minX, maxX, minY, maxY } = this.zoomRect

      const pos = {
        x: this.touchZoomLock.x + (cx - this.touchZoomLock.cx),
        y: this.touchZoomLock.y + (cy - this.touchZoomLock.cy)
      }

      pos.x = Math.min(Math.max(pos.x, minX), maxX)
      pos.y = Math.min(Math.max(pos.y, minY), maxY)

      this.zoomPosition = pos
    },
    bindTouchZoomDoubleTab (e) {
      if (!this.isTouchDevice) return
      if (!this.isDoubleTab) {
        this.isDoubleTab = true
        setCleanTimeout.call(this, () => {
          this.isDoubleTab = false
        }, 500)
      } else {
        const event = new CustomEvent('doubletab', { detail: e })
        this.$refs.zoom.dispatchEvent(event)
      }
    },
    enableZoom (e, initCentered = false) {
      this.animate = true
      this.drag = false
      this.zoom = true

      const isDblTab = e.type === 'doubletab'

      this.setZoomDimensions(this.zoomFactor)
      if (!initCentered || isDblTab) {
        this.onMouseZoomMove(e, isDblTab)
      }

      this.currentZoomFactor = this.zoomFactor
      setCleanTimeout.call(this, () => {
        this.animate = false
      }, 250)
    },
    disableZoom () {
      this.animate = true
      this.drag = true
      this.zoom = false
      this.zoomRect = {}
      this.zoomPosition = { x: 0, y: 0 }
      this.touchZoomLock = { cx: 0, cy: 0, x: 0, y: 0 }
      this.currentZoomFactor = 1
    },
    universalTouch (e) {
      switch (e.type) {
        case 'touchend':
          return e.changedTouches[0]
        case 'touchstart':
        case 'touchmove':
          return e.touches[0]
        case 'doubletab':
          return e.detail
        default:
          return e
      }
    },
    getImageWidth () {
      return this.$refs.track.querySelector('img').clientWidth
    },
    setZoomDimensions (zoomFactor = 1) {
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

      const maxX = bx - rect.x
      const minX = -1 * maxX
      const maxY = by - rect.y
      const minY = -1 * maxY

      this.zoomRect = {
        ...{ bw, bh, bx, by },
        ...{ minX, maxX, minY, maxY },
        ...rect,
        ...zero
      }
    },
    getRelativeCursorPosition (cx, cy, invert = true) {
      const { bx, by, bw, bh } = this.zoomRect
      const rcx = cx - bx
      const rcy = cy - by
      let pcx = Math.min(Math.max(rcx / bw, 0), 1)
      let pcy = Math.min(Math.max(rcy / bh, 0), 1)

      if (!invert) {
        pcx = 1 - pcx
        pcy = 1 - pcy
      }

      return { rcx, rcy, pcx, pcy }
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

    .zoom {
      mix-blend-mode: multiply;
    }

    --image-width: 90%;
  }

  @media (min-width: 1280px) {
    --image-width: 75%;
  }

  .zoom {
    transform: translate(var(--zx, '0px'), var(--zy, '0px')) scale(var(--z, 1));

    &.animate {
      transition: transform .25s ease-out;
    }

    &.enabled {
      touch-action: none;
    }
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

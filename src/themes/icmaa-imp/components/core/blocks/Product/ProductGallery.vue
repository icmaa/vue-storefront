<template>
  <div class="product-gallery t-overflow-hidden">
    <img src="/assets/product-placeholder.svg" class="t-block t-w-full lg:t-w-2/3" v-if="!isOnline">
    <div v-else class="media-gallery t-flex t-items-center t-overflow-hidden" :style="{ '--n': images.length }">
      <product-image v-for="image in images" :key="image" :image="image" />
    </div>
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
      currentSlide: 0,
      galleryLoaded: false
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
    isOnline (value) {
      return onlineHelper.isOnline
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
    transform: translate(calc(var(--i, 0) / var(--n) * (-1 * var(--image-width))));
    transition: transform .5s ease-out;

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

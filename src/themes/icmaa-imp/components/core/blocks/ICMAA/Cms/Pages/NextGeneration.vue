<template>
  <div class="t-bg-white">
    <!-- Header -->
    <div>
      <img :src="getMediaThumbnail(imageUrlHeader, 0, 0)" :alt="content.header.name" :title="content.header.name">
    </div>
    <!-- Text -->
    <div class="t-container t-text-center t-w-3/4 md:t-w-1/2">
      <h2 class="t-text-black t-m-5 t-uppercase t-text-xl" v-html="content.info.headline" />
      <p v-html="content.info.text" />
    </div>
    <!-- Categories -->
    <div class="t-container t-flex t-flex-wrap">
      <div v-for="category in content.categories" :key="category.name" class="t-w-full t-text-center md:t-w-1/2 t-p-10 t-self-center">
        <img :src="getMediaThumbnail(category.img, 0, 0)" :alt="category.name" :title="category.name" class="t-w-full">
        <div v-if="category.text">
          <p class="t-font-bold t-my-4" v-html="category.text" />
          <p class="t-font-bold" v-html="content.voting_price" /><span v-html="category.price_voting" />
          <p class="t-font-bold" v-html="content.jury_price" /><span v-html="category.price_jury" />
          <a :href="category.link">
            <button-component type="primary" size="md" class="t-w-1/2 t-text-center t-bg-base-dark t-container t-text-white t-px-4 t-my-4">
              {{ content.button_text }}
            </button-component>
          </a>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div>
      <img :src="getMediaThumbnail(imageUrlFooter, 0, 0)" :alt="content.footer.name" :title="content.footer.name">
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import ButtonComponent from 'theme/components/core/blocks/Button'
import { mapGetters } from 'vuex'

export default {
  name: 'NextGeneration',
  mixins: [ Page ],
  components: {
    ButtonComponent
  },
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport'
    }),
    isMobile () {
      return ['xs', 'sm'].includes(this.viewport)
    },
    imageUrlHeader () {
      return this.isMobile ? this.content.header.img_mobil : this.content.header.img
    },
    imageUrlFooter () {
      return this.isMobile ? this.content.footer.img_mobil : this.content.footer.img
    }
  }
}
</script>

<template>
  <div class="t-bg-white">
    <!-- Header -->
    <div>
      <picture-component :src="headerImage.src" :width="headerImage.width" :height="headerImage.height" :sizes="headerImage.sizes" :placeholder="true" :ratio="`${headerImage.width}:${headerImage.height}`" :alt="headerImage.alt | htmlDecode" />
    </div>
    <!-- Text -->
    <div class="t-container t-text-center t-w-3/4 md:t-w-1/2">
      <h2 class="t-text-black t-m-5 t-uppercase t-text-xl" v-html="content.info.headline" />
      <p v-html="content.info.text" />
    </div>
    <!-- Categories -->
    <div class="t-container t-flex t-flex-wrap">
      <div v-for="category in categories" :key="category.name" class="t-w-full t-text-center md:t-w-1/2 t-p-10 t-self-center">
        <picture-component :src="category.img.src" :width="category.img.width" :height="category.img.height" :sizes="category.img.sizes" :placeholder="true" :ratio="`${category.img.width}:${category.img.height}`" :alt="category.img.alt | htmlDecode" class="t-w-full" />
        <div v-if="category.text">
          <p class="t-font-bold t-my-4" v-text="category.text" />
          <p class="t-font-bold" v-text="content.voting_price" /><span v-text="category.price_voting" />
          <p class="t-font-bold" v-text="content.jury_price" /><span v-text="category.price_jury" />
          <universal-link :to="category.link" class="t-w-1/2 t-p-2 t-block t-text-center t-bg-base-dark t-container t-text-white t-px-4 t-my-4">
              {{ content.button_text }}
          </universal-link>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div>
      <picture-component :src="footerImage.src" :width="footerImage.width" :height="footerImage.height" :sizes="footerImage.sizes" :placeholder="true" :ratio="`${footerImage.width}:${footerImage.height}`" :alt="footerImage.alt | htmlDecode" />
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import PictureComponent from 'theme/components/core/blocks/Picture'
import ButtonComponent from 'theme/components/core/blocks/Button'
import UniversalLink from 'theme/components/core/blocks/Link'

export default {
  name: 'NextGeneration',
  mixins: [ Page ],
  components: {
    PictureComponent,
    ButtonComponent,
    UniversalLink
  },
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    headerImage () {
      return this.content.header.img
    },
    footerImage () {
      return this.content.footer.img
    },
    categories () {
      return this.content.categories.map(c => {
        const imageDefaults = {
          alt: c.name,
          width: 610,
          height: 460,
          sizes: [
            { media: '(min-width: 415px)', width: 560 },
            { media: '(max-width: 414px)', width: 415 }
          ]
        }

        c.img = Object.assign(imageDefaults, c.img)
        return c
      })
    }
  }
}
</script>

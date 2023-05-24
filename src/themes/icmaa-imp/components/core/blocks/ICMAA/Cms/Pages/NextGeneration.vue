<template>
  <div class="t-bg-white">
    <!-- Header -->
    <div>
      <picture-component
        :src="headerImage.src"
        :width="headerImage.width"
        :height="headerImage.height"
        :sizes="headerImage.sizes"
        :placeholder="true"
        :ratio="`${headerImage.width}:${headerImage.height}`"
        :alt="headerImage.alt | htmlDecode"
      />
    </div>
    <!-- Text -->
    <div class="t-container t-w-3/4 t-text-center md:t-w-1/2">
      <h2
        class="t-m-5 t-text-xl t-uppercase t-text-black"
        v-html="content.info.headline"
      />
      <p v-html="content.info.text" />
    </div>
    <!-- Categories -->
    <div class="t-container t-flex t-flex-wrap">
      <div
        v-for="category in categories"
        :key="category.name"
        class="t-w-full t-self-center t-p-10 t-text-center md:t-w-1/2"
      >
        <picture-component
          :src="category.img.src"
          :width="category.img.width"
          :height="category.img.height"
          :sizes="category.img.sizes"
          :placeholder="true"
          :ratio="`${category.img.width}:${category.img.height}`"
          :alt="category.img.alt | htmlDecode"
          class="t-w-full"
        />
        <div v-if="category.text">
          <p
            class="t-my-4 t-font-bold"
            v-text="category.text"
          />
          <p
            class="t-font-bold"
            v-text="content.voting_price"
          /><span v-text="category.price_voting" />
          <p
            class="t-font-bold"
            v-text="content.jury_price"
          /><span v-text="category.price_jury" />
          <universal-link
            :to="category.link"
            class="t-container t-my-4 t-block t-w-1/2 t-bg-base-dark t-p-2 t-px-4 t-text-center t-text-white"
          >
            {{ content.button_text }}
          </universal-link>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div>
      <picture-component
        :src="footerImage.src"
        :width="footerImage.width"
        :height="footerImage.height"
        :sizes="footerImage.sizes"
        :placeholder="true"
        :ratio="`${footerImage.width}:${footerImage.height}`"
        :alt="footerImage.alt | htmlDecode"
      />
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import PictureComponent from 'theme/components/core/blocks/Picture'
import UniversalLink from 'theme/components/core/blocks/Link'

export default {
  name: 'NextGeneration',
  components: {
    PictureComponent,
    UniversalLink
  },
  mixins: [ Page ],
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
            { media: 'xs', width: 560 },
            { width: 415 }
          ]
        }

        c.img = Object.assign(imageDefaults, c.img)
        return c
      })
    }
  }
}
</script>

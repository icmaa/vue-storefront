<template>
  <div data-test-id="TeaserSmall" class="teaser-small t-flex-fix t-w-1/2 md:t-w-1/4 t-px-4 t-flex t-flex-col t-relative t-cursor-pointer t-webkit-tap-transparent" @click="redirect" @mouseover="onHover" @mouseleave="onHover">
    <div class="t-absolute t-top-0 t-right-0 t-text-sm t-py-2 t-px-3 t-mr-4" :class="{ 't-text-white': !textColor, 't-bg-base-primary': !backgroundColor }" :style="{ 'background-color': backgroundColor, 'color': textColor }" v-if="teaser.buttonText">
      {{ teaser.buttonText | translate }}
    </div>
    <picture-component :src="imageUrl" :alt="teaser.text1 | translate | htmlDecode" :title="teaser.text1 | translate | htmlDecode" :width="288" :height="288" :placeholder="true" :sizes="sizes" ratio="1:1" class="t-flex-fix t-min-w-full t-max-w-full" />
    <h2 class="t-flex-grow t-text-sm t-text-primary t-leading-tight t-pt-4" :class="{ 't-pb-8 lg:t-pb-0': !lastRow }">
      <router-link :to="link" :title="teaser.text1 | translate | htmlDecode" class="t-text-primary">
        {{ teaser.text1 | translate }}
      </router-link>
    </h2>
    <edit-button :edit-url="editUrl" class="t-left-0 t-ml-2 t--mt-2" :class="{ 't-hidden': !hover }" />
  </div>
</template>

<script>
import TeaserMixin from 'icmaa-teaser/mixins/teaserMixin'
import PictureComponent from 'theme/components/core/blocks/Picture'
import ButtonComponent from 'theme/components/core/blocks/Button'
import EditButton from 'theme/components/core/blocks/Teaser/EditButton'

export default {
  name: 'TeaserSmall',
  mixins: [ TeaserMixin ],
  components: {
    PictureComponent,
    EditButton
  },
  computed: {
    sizes () {
      return [
        // Order high-to-low is important
        { media: '(min-width: 1280px)', width: 285 },
        { media: '(min-width: 1024px)', width: 224 },
        { media: '(min-width: 769px)', width: 160 },
        { media: '(max-width: 767px)', width: 285 },
        { media: '(max-width: 415px)', width: 176 }
      ]
    },
    lastRow () {
      return this.index + 1 > 2
    }
  }
}
</script>

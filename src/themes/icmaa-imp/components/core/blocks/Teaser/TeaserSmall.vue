<template>
  <div
    data-test-id="TeaserSmall"
    class="teaser-small t-relative t-flex t-w-1/2 t-flex-fix t-cursor-pointer t-flex-col t-px-4 t-webkit-tap-transparent lg:t-w-1/4"
    @click="redirect"
    @mouseover="onHover"
    @mouseleave="onHover"
  >
    <div
      v-if="teaser.buttonText"
      class="t-absolute t-top-0 t-right-0 t-mr-4 t-py-2 t-px-3 t-text-sm"
      :class="{ 't-text-white': !textColor, 't-bg-base-primary': !backgroundColor }"
      :style="{ 'background-color': backgroundColor, 'color': textColor }"
    >
      {{ teaser.buttonText }}
    </div>
    <picture-component
      :src="imageUrl"
      :alt="teaser.text1 | htmlDecode"
      :width="288"
      :height="288"
      :placeholder="true"
      :sizes="sizes"
      ratio="1:1"
      class="t-min-w-full t-max-w-full t-flex-fix"
    />
    <h2 class="t-grow t-pt-4 t-text-sm t-leading-tight t-text-primary">
      <router-link
        :to="link"
        :title="teaser.text1 | htmlDecode"
        class="t-text-primary"
        @click.native="setGender"
      >
        {{ teaser.text1 }}
      </router-link>
    </h2>
    <edit-button
      :edit-url="editUrl"
      class="t-left-0 t-ml-2 t--mt-2"
      :class="{ 't-hidden': !hover }"
    />
  </div>
</template>

<script>
import TeaserMixin from 'icmaa-teaser/mixins/teaserMixin'
import PictureComponent from 'theme/components/core/blocks/Picture'
import EditButton from 'theme/components/core/blocks/Teaser/EditButton'

export default {
  name: 'TeaserSmall',
  components: {
    PictureComponent,
    EditButton
  },
  mixins: [ TeaserMixin ],
  computed: {
    sizes () {
      return [
        // Order high-to-low is important
        { media: 'xl', width: 285 },
        { media: 'lg', width: 224 },
        { media: 'md', width: 160 },
        { media: 'xs', width: 285 },
        { width: 176 }
      ]
    }
  }
}
</script>

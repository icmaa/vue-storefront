<template>
  <div
    data-test-id="TeaserSplit"
    class="teaser-split t-relative t-mx-4 t-flex t-cursor-pointer t-flex-col t-webkit-tap-transparent md:t-flex-row"
    :class="{ 't-bg-white': !backgroundColor }"
    :style="{ 'background-color': backgroundColor }"
    @click="redirect"
    @mouseover="onHover"
    @mouseleave="onHover"
  >
    <picture-component
      v-if="showLeft"
      :src="imageUrl"
      :width="624"
      :height="624"
      :placeholder="true"
      :sizes="sizes"
      ratio="1:1"
      class="t-w-full md:t-h-full md:t-w-1/2"
      :alt="teaser.text1 | htmlDecode"
    />
    <div class="t-flex t-w-full t-items-center md:t-w-1/2">
      <div class="t-w-full t-p-8">
        <h2 class="t-mb-5 t-w-full t-text-2-1/2xl t-font-bold t-leading-tight">
          <router-link
            :to="link"
            :title="teaser.text1 | htmlDecode"
            :class="{ 't-text-base-darkest': !textColor }"
            :style="{ color: textColor }"
            @click.native="setGender"
          >
            {{ teaser.text1 }}
          </router-link>
        </h2>
        <div
          class="t-mb-10 t-w-full t-text-sm"
          :class="{ 't-text-base-darkest': !textColor }"
          :style="{ color: textColor }"
        >
          {{ teaser.text2 }}
        </div>
        <div class="t-w-full">
          <button-component
            class="t-truncate t-text-xs t-uppercase"
            :type="textColor ? 'ghost-custom' : 'ghost'"
            :custom-color="textColor"
          >
            {{ teaser.buttonText }}
          </button-component>
        </div>
        <div
          v-if="teaser.text3"
          class="t-mt-24 t-hidden t-w-full t-text-sm lg:t-block"
          :class="{ 't-text-base-darkest': !textColor }"
          :style="{ color: textColor }"
        >
          * {{ teaser.text3 }}
        </div>
      </div>
    </div>
    <picture-component
      v-if="!showLeft"
      :src="imageUrl"
      :width="624"
      :height="624"
      :placeholder="true"
      :sizes="sizes"
      ratio="1:1"
      class="t-w-full md:t-h-full md:t-w-1/2"
      :alt="teaser.text1 | htmlDecode"
    />
    <edit-button
      :edit-url="editUrl"
      :class="[ showLeft ? 't-left-0 t--ml-2 t--mt-2' : 't-right-0 t--mr-2 t--mt-2', { 't-hidden': !hover }]"
    />
  </div>
</template>

<script>
import TeaserMixin from 'icmaa-teaser/mixins/teaserMixin'
import PictureComponent from 'theme/components/core/blocks/Picture'
import ButtonComponent from 'theme/components/core/blocks/Button'
import EditButton from 'theme/components/core/blocks/Teaser/EditButton'

export default {
  name: 'TeaserSplit',
  components: {
    PictureComponent,
    ButtonComponent,
    EditButton
  },
  mixins: [ TeaserMixin ],
  computed: {
    sizes () {
      return [
        // Order high-to-low is important
        { media: 'xl', width: 624 },
        { media: 'lg', width: 496 },
        { media: 'md', width: 368 },
        { media: '(max-width: 767px)', width: 768 },
        { media: '(max-width: 550px)', width: 550 },
        { width: 415 }
      ]
    },
    isUneven () {
      return this.index % 2 === 0
    },
    showLeft () {
      return this.isUneven || !this.viewport || ['xs', 'sm'].includes(this.viewport)
    }
  }
}
</script>

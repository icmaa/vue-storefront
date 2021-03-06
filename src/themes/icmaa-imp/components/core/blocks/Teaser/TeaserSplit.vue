<template>
  <div data-test-id="TeaserSplit" class="teaser-split t-relative t-flex t-flex-col md:t-flex-row t-mx-4 t-cursor-pointer t-webkit-tap-transparent" :class="{ 't-bg-white': !backgroundColor }" :style="{ 'background-color': backgroundColor }" @click="redirect" @mouseover="onHover" @mouseleave="onHover">
    <picture-component :src="imageUrl" :width="624" :height="624" :placeholder="true" :sizes="sizes" ratio="1:1" class="t-w-full md:t-w-1/2 md:t-h-full" :alt="teaser.text1 | translate | htmlDecode" v-if="showLeft" />
    <div class="t-w-full md:t-w-1/2 t-flex t-items-center">
      <div class="t-w-full t-p-8">
        <h2 class="t-w-full t-leading-tight t-font-bold t-text-2-1/2xl t-mb-5">
          <router-link :to="link" @click.native="setGender" :title="teaser.text1 | translate | htmlDecode" :class="{ 't-text-base-darkest': !textColor }" :style="{ color: textColor }">
            {{ teaser.text1 | translate }}
          </router-link>
        </h2>
        <div class="t-w-full t-text-sm t-mb-10" :class="{ 't-text-base-darkest': !textColor }" :style="{ color: textColor }">
          {{ teaser.text2 | translate }}
        </div>
        <div class="t-w-full">
          <button-component class="t-text-xs t-uppercase t-truncate" :type="textColor ? 'ghost-custom' : 'ghost'" :custom-color="textColor">
            {{ teaser.buttonText | translate }}
          </button-component>
        </div>
        <div v-if="teaser.text3" class="t-w-full t-hidden lg:t-block t-text-sm t-mt-24" :class="{ 't-text-base-darkest': !textColor }" :style="{ color: textColor }">
          * {{ teaser.text3 | translate }}
        </div>
      </div>
    </div>
    <picture-component :src="imageUrl" :width="624" :height="624" :placeholder="true" :sizes="sizes" ratio="1:1" class="t-w-full md:t-w-1/2 md:t-h-full" :alt="teaser.text1 | translate | htmlDecode" v-if="!showLeft" />
    <edit-button :edit-url="editUrl" :class="[ showLeft ? 't-left-0 t--ml-2 t--mt-2' : 't-right-0 t--mr-2 t--mt-2', { 't-hidden': !hover }]" />
  </div>
</template>

<script>
import TeaserMixin from 'icmaa-teaser/mixins/teaserMixin'
import PictureComponent from 'theme/components/core/blocks/Picture'
import ButtonComponent from 'theme/components/core/blocks/Button'
import EditButton from 'theme/components/core/blocks/Teaser/EditButton'

export default {
  name: 'TeaserSplit',
  mixins: [ TeaserMixin ],
  components: {
    PictureComponent,
    ButtonComponent,
    EditButton
  },
  computed: {
    sizes () {
      return [
        // Order high-to-low is important
        { media: '(min-width: 1280px)', width: 624 },
        { media: '(min-width: 1024px)', width: 496 },
        { media: '(min-width: 768px)', width: 368 },
        { media: '(max-width: 767px)', width: 768 },
        { media: '(max-width: 550px)', width: 550 },
        { media: '(max-width: 415px)', width: 415 }
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

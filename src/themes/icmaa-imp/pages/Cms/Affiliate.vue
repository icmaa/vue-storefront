<template>
  <div class="t-container t-bg-base-dark t-text-center t-text-white">
    <!-- banner -->
    <div class="t-flex t-justify-center">
      <img
        :src="getMediaThumbnail(imageUrlHeader, 0, 0)"
        :alt="content.header.alt"
        :title="content.header.alt"
        class="t-mb-4 t-border-b t-border-base-lightest"
      >
    </div>

    <div class="t-p-4 md:t-p-8 lg:t-p-16">
      <div
        v-for="about in content.aboutus"
        :key="about.text"
      >
        <div class="t-mb-8 t-mt-4">
          {{ about.text }}
        </div>
      </div>

      <LinkComponent
        :to="content.applybutton.link"
        :title="content.applybutton.link"
        class="t-mb-5 t-flex t-justify-center t-pb-5 t-text-sm t-leading-tight t-text-primary"
      >
        <ButtonComponent
          type="primary"
          size="sm"
          class="t-mt-2"
        >
          {{ content.applybutton.text }}
        </ButtonComponent>
      </LinkComponent>

      <hr class="t-mx-16 md:t-mx-24 lg:t-mx-96">

      <!-- Creator-Programm Images -->
      <div class="t-mb-16 t-mt-5 t-flex t-flex-wrap t-items-center t-justify-center t-pt-5">
        <div
          v-for="img in content.creatorprogrammimg"
          :key="img.link"
          class="t-w-1/2 t-p-4 md:t-w-1/4"
        >
          <img
            :src="getMediaThumbnail(img.link, 0, 0)"
            :alt="img.alt"
            :title="img.alt"
            class="t-w-full"
          >
        </div>
      </div>

      <hr class="t-mx-16 md:t-mx-24 lg:t-mx-96">

      <div class="t-mb-10 t-mt-5 t-flex t-justify-center t-pt-5 t-font-bold t-leading-snug">
        <div class="t-w-3/4">
          {{ content.creator.headline }}
        </div>
      </div>

      <div class="t-mb-10 t-flex t-justify-center t-font-normal t-leading-snug">
        <div class="t-w-3/4">
          {{ content.creator.text }}
        </div>
      </div>

      <LinkComponent
        :to="content.creator.button.link"
        :title="content.creator.button.text"
        class="t-mb-5 t-flex t-justify-center t-pb-5 t-text-sm t-leading-tight t-text-primary"
      >
        <ButtonComponent
          type="primary"
          size="sm"
          class="t-mt-2"
        >
          {{ content.creator.button.text }}
        </ButtonComponent>
      </LinkComponent>

      <hr class="t-mx-16 md:t-mx-24 lg:t-mx-96">

      <div class="t-mb-16 t-mt-5 t-flex t-flex-wrap t-items-center t-justify-center t-pt-5">
        <div
          v-for="img in content.processimg"
          :key="img.link"
          class="t-w-1/5 md:t-w-1/5"
        >
          <img
            :src="getMediaThumbnail(img.link, 0, 0)"
            :alt="img.alt"
            :title="img.alt"
            class="t-w-full"
          >
        </div>
      </div>

      <div class="t-mb-8 t-flex t-justify-center t-font-normal t-leading-snug">
        <div class="t-w-3/4">
          {{ content.processtext }}
        </div>
      </div>

      <LinkComponent
        :to="content.awinhelp.link"
        :title="content.awinhelp.text"
        class="t-mb-5 t-flex t-justify-center t-pb-5 t-text-sm t-leading-tight t-text-primary"
      >
        <ButtonComponent
          type="primary"
          size="sm"
          class="t-mt-2"
        >
          {{ content.awinhelp.text }}
        </ButtonComponent>
      </LinkComponent>

      <hr class="t-mx-16 md:t-mx-24 lg:t-mx-96">

      <!--List of advantages-->
      <div class="t-mb-8 t-mt-5 t-flex t-flex-wrap t-justify-center t-pt-5">
        <div
          v-for="(block, index) in content.advantages"
          :key="index"
          class="t-mb-4 t-w-full t-text-left md:t-mr-6 md:t-w-2/5"
        >
          <div class="t-mb-4 t-p-1 t-text-xl t-font-bold t-uppercase">
            {{ block.headline }}
          </div>
          <div>
            <ul class="t-list-disc t-pl-6">
              <li
                v-for="(entry, row) in block.list"
                :key="row"
                class="t-mb-2"
              >
                {{ entry.text }}
              </li>
            </ul>
            <div
              v-if="(block.img)"
              class=" t-mx-16 t-mt-10"
            >
              <img :src="getMediaThumbnail(block.img.link, 0, 0)">
            </div>
          </div>
        </div>
      </div>

      <hr class="t-mx-16 md:t-mx-24 lg:t-mx-96">

      <!-- AWIN -->
      <div class="t-mb-8 t-mt-5 t-flex t-flex-wrap t-justify-center t-pt-5">
        <a
          :href="content.awin.link"
          class="t-cursor-pointer lg:t-w-2/3"
        >
          <img
            :src="getMediaThumbnail(content.awin.img, 0, 0)"
            :alt="content.awin.alt"
            :title="content.awin.alt"
            class="t-w-full"
          >
        </a>
      </div>
      <div class="t-mb-10 t-flex t-justify-center t-font-normal t-leading-snug">
        <div class="t-w-3/4 t-text-[9px]">
          {{ content.awin.text }}
        </div>
      </div>

      <hr class="t-mx-16 md:t-mx-24 lg:t-mx-96">

      <div class="t-mb-16 t-mt-5 t-flex t-justify-center t-pt-5 t-font-bold t-leading-snug">
        <div class="t-w-3/4 t-text-xl">
          {{ content.questionheadline }}
        </div>
      </div>

      <!-- footer -->
      <div class="t-mb-8">
        <div class="t-mb-8">
          {{ content.footer.description }}
        </div>
        <a
          class="t-font-semibold t-text-white"
          :href="content.footer.link"
          :title="content.footer.linktext"
        >
          {{ content.footer.linktext }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import ButtonComponent from 'theme/components/core/blocks/Button';
import LinkComponent from 'theme/components/core/blocks/Link';
import { mapGetters } from 'vuex'

export default {
  name: 'Affiliates',
  components: {
    ButtonComponent,
    LinkComponent
  },
  mixins: [ Page ],
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
      return this.isMobile ? this.content.header.img_mob : this.content.header.img
    }
  },
  methods: {
    hasImage (block) {
      return Object.keys(block).includes('img')
    }
  }
}
</script>

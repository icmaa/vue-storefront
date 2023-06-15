<template>
  <div class="t-container t-bg-base-dark t-p-4 t-text-center t-uppercase t-text-white md:t-p-8 lg:t-p-16">
    <!-- banner -->
    <div class="t-flex t-justify-center">
      <img
        :src="getMediaThumbnail(content.header.img, 0, 0)"
        :alt="content.header.alt"
        :title="content.header.alt"
        class="t-mb-4 t-mt-8 t-w-2/3 t-border-b t-border-base-lightest t-pb-8"
      >
    </div>

    <div class="t-mb-8 t-flex t-w-full t-justify-center">
      <MaterialIcon
        icon="arrow_drop_down_circle"
        size="xl"
        class=""
      />
    </div>

    <!-- description -->
    <div class="t-mb-8 t-mt-4">
      {{ content.aboutustext1 }}
    </div>

    <div class="t-mb-8 t-mt-4">
      {{ content.aboutustext2 }}
    </div>

    <div class="t-mb-8 t-mt-4">
      {{ content.aboutustext3 }}
    </div>

    <div>
      <button class="rounded-full t-flex t-justify-center">
        {{ content.applybutton }}
      </button>
    </div>

    <hr>

    <!-- Creator-Programm Images -->
    <div class="t-flex t-justify-center">
      <img
        :src="getMediaThumbnail(content.creatorprogramm.img, 0, 0)"
        :alt="content.creatorprogramm.alt"
        :title="content.creatorprogramm.alt"
        class="t-mb-4 t-mt-8 t-w-2/3 t-border-b t-border-base-lightest t-pb-8"
      >
    </div>

    <div class="t-mb-16 t-flex t-justify-center t-font-normal t-leading-snug">
      <div class="t-w-3/4">
        {{ content.creatortext }}
      </div>
    </div>

    <hr>

    <div class="t-mb-16 t-flex t-justify-center t-font-bold t-leading-snug">
      <div class="t-w-3/4">
        {{ content.applyheadline }}
      </div>
    </div>

    <div class="t-mb-16 t-flex t-justify-center t-font-normal t-leading-snug">
      <div class="t-w-3/4">
        {{ content.applytext }}
      </div>
    </div>

    <div>
      <button class="rounded-full t-flex t-justify-center">
        {{ content.registerbutton }}
      </button>
    </div>

    <!-- Apllication process -->
    <div class="t-mb-16 t-flex t-flex-wrap t-items-center t-justify-center">
      <div
        v-for="img in content.processimg"
        :key="img.link"
        class="t-mb-6 t-w-full md:t-mr-6 md:t-w-2/5"
      >
        <img
          :src="getMediaThumbnail(img.link, 0, 0)"
          :alt="img.alt"
          :title="img.alt"
          class="t-w-full"
        >
      </div>
    </div>

    <div class="t-mb-16 t-flex t-justify-center t-font-normal t-leading-snug">
      <div class="t-w-3/4">
        {{ content.processtext }}
      </div>
    </div>

    <hr>

    <!-- List of advantages  -->
    <div class="t-mb-8 t-flex t-flex-wrap t-justify-center">
      <div
        v-for="(block, index) in content.advantages"
        :key="index"
        class="t-mb-4 t-w-full md:t-mr-6 md:t-w-2/5"
      >
        <div class="t-mb-4 t-border t-p-1">
          {{ block.headline }}
        </div>
        <template v-if="!hasImage(block)">
          <ul class="t-list-disc t-pl-16 t-text-left t-text-xs">
            <li
              v-for="(entry, row) in block.list"
              :key="row"
              class="t-mb-2"
            >
              {{ entry.text }}
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="t-flex t-justify-center t-px-4">
            <img :src="getMediaThumbnail(block.img.link, 0, 0)">
          </div>
        </template>
      </div>
    </div>

    <hr>

    <!-- AWIN -->
    <div class="t-mb-8 t-flex t-flex-wrap t-justify-center">
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

    <hr>

    <div class="t-mb-16 t-flex t-justify-center t-font-bold t-leading-snug">
      <div class="t-w-3/4">
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
        :title="content.footer.title"
      >{{ content.footer.title }}</a>
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'Affiliates',
  components: {
    MaterialIcon
  },
  mixins: [ Page ],
  data () {
    return {
      dataType: 'yaml'
    }
  },
  methods: {
    hasImage (block) {
      return Object.keys(block).includes('img')
    }
  }
}
</script>

<template :class="content.backgroundcolor">
  <div class="t-bg-festival-container">
    <!-- Header -->
    <div>
      <router-link :to="content.header.link">
        <img
          :src="getMediaThumbnail(content.header.img, 0, 0)"
          :alt="content.header.alt"
          :title="content.header.alt"
        >
      </router-link>
    </div>

    <!-- Cities -->
    <ul class="t-bg-festival t-mt-4 t-flex t-justify-center">
      <li
        v-for="(city, index) in content.cities"
        :key="index"
        class="city-item"
        :class="{active: currentTab === index}"
        @click="currentTab = index"
      >
        <router-link
          :to="'#' + index"
          class="t-block t-p-2 t-text-sm t-uppercase t-text-white md:t-p-5 md:t-text-xl"
        >
          {{ city.name }}
        </router-link>
      </li>
    </ul>

    <div class="tab-content">
      <div
        v-for="(city, index) in content.cities"
        v-show="currentTab === index"
        :key="index"
        :class="{active: currentTab === index}"
      >
        <router-link :to="city.link">
          <img
            :src="getMediaThumbnail(city.img, 0, 0)"
            :alt="city.name"
            :title="city.name"
          >
        </router-link>
      </div>
    </div>

    <!-- Extras -->
    <div class="t-mt-8">
      <router-link :to="content.extra.link">
        <img
          :src="getMediaThumbnail(content.extra.img, 0, 0)"
          :alt="content.extra.alt"
          :title="content.extra.alt"
        >
      </router-link>
    </div>
    <!-- Video -->
    <div class="t-container t-w-full">
      <h2
        class="t-my-4 t-text-center t-text-4xl t-text-white"
        v-html="content.video.headline"
      />
      <div
        class="t-relative t-w-full t-bg-white"
        style="padding-top: 56.25%"
      >
        <iframe
          class="t-absolute t-top-0"
          width="100%"
          height="100%"
          :src="content.video.link"
          title="YouTube Video"
          frameborder="0"
          allowfullscreen
        />
      </div>
    </div>

    <!-- Sponsors -->
    <div class="t-flex t-flex-wrap t-justify-center">
      <div
        v-for="sponsor in content.sponsors"
        :key="sponsor.name"
        class="t-my-6 t-block"
      >
        <a :href="sponsor.link">
          <img
            :src="getMediaThumbnail(sponsor.img, 0, 0)"
            :alt="sponsor.name"
            :title="sponsor.name"
            width="120"
          >
        </a>
      </div>
    </div>

    <!-- Press -->
    <div class="t-flex t-justify-center">
      <a :href="content.press.link">
        <button-component
          type="primary"
          size="sm"
          class="t-bg-festival t-my-6 t-block t-w-full t-px-4 t-py-2 t-text-white"
        >
          {{ content.press.button }}
        </button-component>
      </a>
    </div>

    <!-- Gallery-->
    <div class="t-flex t-flex-wrap">
      <div
        v-for="galleryitem in content.gallery"
        :key="galleryitem.img"
        class="t-w-1/2 md:t-w-1/3 lg:t-w-1/6"
      >
        <picture-component
          :src="galleryitem.img"
          :width="600"
          :height="400"
          :sizes="galleryImgSizes"
          :placeholder="true"
          ratio="3:2"
          :alt="galleryitem.name"
          :title="galleryitem.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import ButtonComponent from 'theme/components/core/blocks/Button'
import PictureComponent from 'theme/components/core/blocks/Picture'

export default {
  name: 'Festival',
  components: {
    ButtonComponent,
    PictureComponent
  },
  mixins: [ Page ],
  data () {
    return {
      dataType: 'yaml',
      currentTab: 0
    }
  },
  computed: {
    galleryImgSizes () {
      return [
        { media: 'lg', width: 240 },
        { media: 'md', width: 300 },
        { width: 220 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.t-bg-festival-container {
  background-color: #e0d8c3
}

.t-bg-festival {
  background-color: #3d0c0b
}
</style>

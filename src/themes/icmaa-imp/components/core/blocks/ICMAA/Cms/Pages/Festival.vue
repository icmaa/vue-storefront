<template>
  <layout id="festival" :headline="content.headline">
    <!-- Header -->
    <div>
      <router-link :to="content.header.link">
        <img :src="getMediaThumbnail(content.header.img, 0, 0)" :alt="content.header.alt" :title="content.header.alt">
      </router-link>
    </div>

    <!-- Cities -->
    <ul class="t-flex t-mt-8 t-bg-primary">
      <li class="city-item" v-for="(city, index) in content.cities" :key="index" @click="currentTab = index" :class="{active: currentTab === index}">
        <router-link :to="'#' + city.name" class="t-text-white t-block t-m-5 t-uppercase t-text-xl">
          {{ city.name }}
        </router-link>
      </li>
    </ul>

    <div class="tab-content">
      <div v-for="(city, index) in content.cities" :key="index" :class="{active: currentTab === index}" v-show="currentTab === index">
        <router-link :to="city.link">
          <img :src="getMediaThumbnail(city.img, 0, 0)" :alt="city.name" :title="city.name">
        </router-link>
      </div>
    </div>

    <!-- Extras -->
    <div class="t-mt-8">
      <router-link :to="content.extra.link">
        <img :src="getMediaThumbnail(content.extra.img, 0, 0)" :alt="content.extra.alt" :title="content.extra.alt">
      </router-link>
    </div>
    <!-- Video -->
    <div class="t-container t-text-center">
      <h2 class="t-text-white" v-html="content.video.headline" />
      <iframe height="315" width="560" :src="content.video.link" frameborder="0" allowfullscreen />
    </div>

    <!-- Sponsors -->
    <div class="t-container t-flex t-flex-wrap">
      <div v-for="sponsor in content.sponsors" :key="sponsor.name">
        <router-link :to="sponsor.link">
          <img :src="getMediaThumbnail(sponsor.img, 0, 0)" :alt="sponsor.name" :title="sponsor.name" width="120">
        </router-link>
      </div>
    </div>

    <!-- Press -->
    <div class="t-container">
      <router-link :to="content.press.link" :title="content.press.button">
        <button-component type="primary" size="sm" class="t-text-xs t-uppercase t-truncate">
          {{ content.press.button }}
        </button-component>
      </router-link>
    </div>

    <!-- Gallery-->
    <div class="t-flex t-flex-wrap">
      <img v-for="galleryitem in content.gallery" :key="galleryitem.name" :src="getMediaThumbnail(galleryitem.img, 0, 0)" :alt="galleryitem.name" :title="galleryitem.name" class="t-w-1/2 md:t-w-1/3 lg:t-w-1/6">
    </div>
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Festival',
  mixins: [ Page ],

  data () {
    return {
      dataType: 'yaml',
      currentTab: 0
    }
  }
}
</script>

<style lang="scss" scoped>
li.city-item:first-child {
  display: none
}
</style>

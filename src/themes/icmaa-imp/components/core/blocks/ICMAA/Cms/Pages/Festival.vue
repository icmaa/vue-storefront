<template>
  <layout id="festival" :headline="content.headline">
    <h1 class="t-text-center" v-html="content.headline" />

    <!-- Header -->
    <div>
      <router-link :to="content.header.link">
        <img :src="getMediaThumbnail(content.header.img, 0, 0)" :alt="content.header.alt" :title="content.header.alt">
      </router-link>
    </div>

    <!-- Cities -->
    <ul class="t-flex">
      <li v-for="(city, index) in content.cities" :key="index" @click="currentTab = index" :class="{active: currentTab === index}">
        <router-link :to="'#' + city.name">
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
    <div>
      <router-link :to="content.extra.link">
        <img :src="getMediaThumbnail(content.extra.img, 0, 0)" :alt="content.extra.alt" :title="content.extra.alt">
      </router-link>
    </div>
    <!-- Video -->
    <div class="t-text-center">
      <h2 class="t-text-white" v-html="content.video.headline" />
      <iframe height="315" width="560" :src="content.video.link" frameborder="0" allowfullscreen />
    </div>

    <!-- Sponsors -->
    <div>
      <div v-for="sponsor in content.sponsors" :key="sponsor.name">
        <div class="t-relative">
          <router-link :to="sponsor.link">
            <img :src="getMediaThumbnail(sponsor.img, 0, 0)" :alt="sponsor.name" :title="sponsor.name" width="120">
          </router-link>
        </div>
      </div>
    </div>

    <!-- Press -->
    <div>
      <router-link :to="content.press.link" :title="content.press.button">
        <button-component type="primary" size="sm" class="t-text-xs t-uppercase t-truncate">
          {{ content.press.button }}
        </button-component>
      </router-link>
    </div>

    <!-- Gallery-->
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

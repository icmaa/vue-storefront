<template :class="content.backgroundcolor">
  <layout id="insd" :headline="content.headline">
    <div class="t-bg-insd-container">
      <!-- if coming soon -->
      <div v-if="content.coming_soon.img">
        <img :src="getMediaThumbnail(content.coming_soon.img, 0, 0)" :alt="content.coming_soon.name" :title="content.coming_soon.name">
      </div>

      <div v-else class="t-container t-px-4 t-pb-1">
        <!-- Header -->
        <div>
          <router-link :to="content.header.link">
            <img :src="getMediaThumbnail(content.header.img, 0, 0)" :alt="content.header.name" :title="content.header.name">
          </router-link>
        </div>

        <!-- Navigation -->
        <ul class="t-flex t-justify-center t-bg-insd">
          <li v-for="navitem in content.navigation" :key="navitem.name">
            <router-link :to="'#' + navitem.link" class="t-text-white t-block t-m-5 t-uppercase t-text-xl">
              {{ navitem.name }}
            </router-link>
          </li>
        </ul>

        <!-- Info -->
        <div>
          <router-link :to="content.info.link">
            <img :src="getMediaThumbnail(content.info.img, 0, 0)" :alt="content.info.name" :title="content.info.name">
          </router-link>
        </div>

        <!-- Info Teaser -->

        <div class="t-flex t-justify-center t-flex">
          <div v-for="infoteaseritem in content.infoteaser" :key="infoteaseritem.name" class="t-w-1/2">
            <a :href="infoteaseritem.link">
              <img :src="getMediaThumbnail(infoteaseritem.img, 0, 0)" :alt="infoteaseritem.name" :title="infoteaseritem.name">
            </a>
          </div>
        </div>

        <!-- Info Video -->
        <div class="t-container t-w-full t-bg-insd">
          <h2 class="t-text-white t-block t-m-5 t-uppercase t-text-xl" v-html="content.infovideo.headline" />
          <div class="t-relative t-w-full t-bg-white" style="padding-top: 56.25%">
            <iframe class="t-absolute t-top-0" width="100%" height="100%" :src="content.infovideo.link" frameborder="0" allowfullscreen />
          </div>
        </div>

        <!-- Bands -->
        <div id="bands" class="t-w-full t-flex t-bg-insd">
          <h2 class="t-text-white t-block t-m-5 t-uppercase t-text-xl" v-html="content.bands_headline" />
        </div>

        <div class="t-bg-insd-containert t-text-white">
          <div v-for="headlineband in content.headlinebands" :key="headlineband.name" class="t-p-4 t-block t-bg-insd-box t-mb-1">
            <h3 v-html="headlineband.name" class="t-mx-1 t-flex t-text-white t-mb-4" />

            <div class="t-flex">
              <div class="t-w-1/2">
                <img :src="getMediaThumbnail(headlineband.img, 0, 0)" :alt="headlineband.name" :title="headlineband.name">
              </div>
              <div class="t-w-1/2">
                <div class="t-relative t-w-full t-bg-white" style="padding-top: 55%">
                  <iframe class="t-absolute t-top-0" width="100%" height="100%" :src="headlineband.video" frameborder="0" allowfullscreen />
                </div>
              </div>
            </div>
            <div class="t-mt-2">
              <a :href="headlineband.facebook" class="t-mr-4 t-text-white">Facebook</a>
              <a :href="headlineband.link" class="t-mr-4 t-text-white">Merchandise shoppen</a>
            </div>
          </div>
        </div>

        <div class="t-flex t-flex-wrap t-bg-insd-box t-text-white">
          <div v-for="band in content.bands" :key="band.name" class="t-block t-my-6">
            <h3 v-html="band.name" />

            <div class="t-flex">
              <div class="t-w-1/2">
                <img :src="getMediaThumbnail(band.img, 0, 0)" :alt="band.name" :title="band.name">
              </div>
              <div class="t-w-1/2">
                <div class="t-relative t-w-full t-bg-white" style="padding-top: 56.25%">
                  <iframe class="t-absolute t-top-0" width="100%" height="100%" :src="band.video" frameborder="0" allowfullscreen />
                </div>
              </div>
            </div>
            <div class="t-mt-2">
              <a :href="band.facebook" class="t-mx-4">Facebook</a>
              <a :href="band.link" class="t-mx-4">Merchandise shoppen</a>
            </div>
          </div>
        </div>

        <!-- Tickets -->
        <div id="tickets" class="t-w-full t-flex t-bg-insd">
          <h2 class="t-text-white t-block t-m-5 t-uppercase t-text-xl" v-html="content.tickets_headline" />
        </div>

        <div v-for="ticket in content.tickets" :key="ticket.date" class="t-flex t-mb-1 t-p-5 t-bg-insd-box">
          <div class="t-w-1/6">
            {{ ticket.date }}
          </div>
          <div class="t-w-1/3">
            {{ ticket.city }}, <span class="t-text-insd">{{ ticket.venue }}</span>
          </div>
          <div class="t-w-1/6">
            <a :href="ticket.shoplink" class="t-text-white">{{ ticket.shoplinktext }}</a>
          </div>
          <div class="t-w-1/3 t-text-white">
            <a :href="ticket.facebooklink" class="t-text-white">{{ ticket.facebooklinktext }}</a>
          </div>
        </div>

        <!-- Kontakt -->
        <div id="contact" class="t-w-full t-flex t-bg-insd">
          <h2 class="t-text-white t-block t-m-5 t-uppercase t-text-xl" v-html="content.contact.headline" />
        </div>

        <!-- Sponsoren -->
        <div class="t-flex t-justify-center t-flex t-flex-wrap t-bg-insd-box t-my-2">
          <div v-for="sponsor in content.sponsors" :key="sponsor.name" class="t-block t-my-6 t-mx-4">
            <a :href="sponsor.link">
              <img :src="getMediaThumbnail(sponsor.img, 0, 0)" :alt="sponsor.name" :title="sponsor.name">
            </a>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'

export default {
  name: 'ImpericonNeverSayDie',
  mixins: [ Page ],

  data () {
    return {
      dataType: 'yaml'
    }
  }
}
</script>

<style lang="scss" scoped>
.t-bg-insd-container {
  background-color: #09131f
}

.t-bg-insd-box {
  background-color: #59564d
}

.t-bg-insd {
  background-color: #cfc8b6
}

.t-text-insd {
  color: #cfc8b6
}

</style>

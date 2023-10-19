<template :class="content.backgroundcolor">
  <div class="t-bg-insd-container">
    <!-- if coming soon -->
    <div v-if="content.coming_soon.img">
      <img
        :src="getMediaThumbnail(content.coming_soon.img, 0, 0)"
        :alt="content.coming_soon.name"
        :title="content.coming_soon.name"
      >
    </div>

    <div
      v-else
      class="t-container t-px-4 t-pb-1"
    >
      <!-- Header -->
      <div>
        <router-link :to="content.header.link">
          <img
            :src="getMediaThumbnail(content.header.img, 0, 0)"
            :alt="content.header.name"
            :title="content.header.name"
          >
        </router-link>
      </div>

      <!-- Navigation -->
      <ul class="t-bg-insd t-flex t-justify-center">
        <li
          v-for="navitem in content.navigation"
          :key="navitem.name"
        >
          <router-link
            :to="'#' + navitem.link"
            class="t-block t-p-2 t-text-sm t-uppercase t-text-black md:t-p-5 md:t-text-xl"
          >
            {{ navitem.name }}
          </router-link>
        </li>
      </ul>

      <!-- Info -->
      <div>
        <router-link :to="content.info.link">
          <img
            :src="getMediaThumbnail(content.info.img, 0, 0)"
            :alt="content.info.name"
            :title="content.info.name"
          >
        </router-link>
      </div>

      <!-- Info Teaser -->

      <div class="t-flex t-justify-center">
        <div
          v-for="infoteaseritem in content.infoteaser"
          :key="infoteaseritem.name"
          class="t-w-1/2"
        >
          <a :href="infoteaseritem.link">
            <img
              :src="getMediaThumbnail(infoteaseritem.img, 0, 0)"
              :alt="infoteaseritem.name"
              :title="infoteaseritem.name"
            >
          </a>
        </div>
      </div>

      <!-- Info Video -->
      <div class="t-bg-insd t-mt-8 t-w-full">
        <h2
          class="t-p-5 t-text-xl t-uppercase t-text-black"
          v-html="content.infovideo.headline"
        />
        <div
          class="t-relative t-w-full t-bg-white"
          style="padding-top: 56.25%"
        >
          <iframe
            class="t-absolute t-top-0"
            width="100%"
            height="100%"
            :src="content.infovideo.link"
            title="YouTube Video"
            frameborder="0"
            allowfullscreen
          />
        </div>
      </div>

      <!-- Bands Headliner -->
      <div
        id="bands"
        class="t-bg-insd t-mt-8 t-flex t-w-full"
      >
        <h2
          class="t-m-5 t-block t-text-xl t-uppercase t-text-black"
          v-html="content.band_headline"
        />
      </div>

      <div class="t-bg-insd-container t-text-white">
        <div
          v-for="headlineband in content.headlinebands"
          :key="headlineband.name"
          class="t-bg-insd-box t-mb-1 t-block t-p-4"
        >
          <h3
            class="t-mx-1 t-mb-4 t-flex t-text-white"
            v-html="headlineband.name"
          />

          <div class="t-flex-none md:t-flex">
            <div class="t-w-full md:t-w-1/2">
              <img
                :src="getMediaThumbnail(headlineband.img, 0, 0)"
                :alt="headlineband.name"
                :title="headlineband.name"
                class="t-w-full"
              >
            </div>
            <div class="t-w-full md:t-w-1/2">
              <div
                class="t-relative t-w-full t-bg-white"
                style="padding-top: 57.75%"
              >
                <iframe
                  class="t-absolute t-top-0"
                  width="100%"
                  height="100%"
                  :src="headlineband.video"
                  title="YouTube Video"
                  frameborder="0"
                  allowfullscreen
                />
              </div>
            </div>
          </div>
          <div class="t-mt-2">
            <a
              :href="headlineband.facebook"
              class="t-mr-4 t-text-white"
            >Facebook-Link</a>
            <a
              :href="headlineband.link"
              class="t-mr-4 t-text-white"
            >Merchandise shoppen</a>
          </div>
        </div>
      </div>

      <!-- Bands -->
      <div class="t-bg-insd-container t-flex t-flex-wrap t-text-white">
        <div
          v-for="band in content.bands"
          :key="band.name"
          class="t-bg-insd-box t-mb-1 t-flex t-w-full t-flex-wrap t-p-4 md:t-w-1/2 "
        >
          <h3
            class="t-mx-1 t-mb-4 t-flex t-text-white"
            v-html="band.name"
          />

          <div class="t-flex">
            <div class="t-w-1/2">
              <img
                :src="getMediaThumbnail(band.img, 0, 0)"
                :alt="band.name"
                :title="band.name"
              >
            </div>
            <div class="t-w-1/2">
              <div
                class="t-relative t-w-full t-bg-white"
                style="padding-top: 57.75%"
              >
                <iframe
                  class="t-absolute t-top-0"
                  width="100%"
                  height="100%"
                  :src="band.video"
                  title="YouTube Video"
                  frameborder="0"
                  allowfullscreen
                />
              </div>
            </div>
          </div>
          <div class="t-mt-2">
            <a
              :href="band.facebook"
              class="t-mr-4 t-text-white"
            >Facebook-Link</a>
            <a
              :href="band.link"
              class="t-mr-4 t-text-white"
            >Merchandise shoppen</a>
          </div>
        </div>
      </div>

      <!-- Tickets -->
      <div
        id="tickets"
        class="t-bg-insd t-mt-8 t-flex t-w-full"
      >
        <h2
          class="t-text-back t-m-5 t-block t-text-xl t-uppercase"
          v-html="content.tickets_headline"
        />
      </div>

      <div
        v-for="ticket in content.tickets"
        :key="ticket.date"
        class="t-bg-insd-box t-mb-1 t-flex-none t-p-5 t-text-white md:t-flex"
      >
        <div class="t-inline md:t-w-1/6">
          {{ ticket.date }}
        </div>
        <div class="t-inline md:t-w-1/3">
          {{ ticket.city }}, <span class="t-text-insd"> {{ ticket.venue }}</span>
        </div>
        <div class="t-mt-2 t-block md:t-mt-0 md:t-w-1/6">
          <a
            :href="ticket.shoplink"
            class="t-text-white"
          >{{ ticket.shoplinktext }}</a>
        </div>
        <div class="t-blovk md:t-w-1/3">
          <a
            :href="ticket.facebooklink"
            class="t-text-white"
          >{{ ticket.facebooklinktext }}</a>
        </div>
      </div>

      <!-- Kontakt -->
      <div
        id="contact"
        class="t-bg-insd t-mt-8 t-flex t-w-full"
      >
        <h2
          class="t-m-5 t-block t-text-xl t-uppercase t-text-black"
          v-html="content.contact.headline"
        />
      </div>

      <div class="t-bg-insd-box t-mb-1 t-p-5 t-text-white">
        <p>{{ content.contact.text }}</p>
        <p class="t-text-3xl">
          {{ content.contact.tel }}
        </p>
      </div>

      <!-- Sponsoren -->
      <div class="t-bg-insd-box t-my-8 t-flex t-flex-wrap t-justify-center">
        <div
          v-for="sponsor in content.sponsors"
          :key="sponsor.name"
          class="t-mx-4 t-my-6 t-block"
        >
          <a :href="sponsor.link">
            <img
              :src="getMediaThumbnail(sponsor.img, 0, 0)"
              :alt="sponsor.name"
              :title="sponsor.name"
            >
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'

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
  background-color: #1B1634
}

.t-bg-insd-box {
  background-color: #3A2359
}

.t-bg-insd {
  background-color: #D4BFFF
}

.t-text-insd {
  color: #cfc8b6
}

</style>

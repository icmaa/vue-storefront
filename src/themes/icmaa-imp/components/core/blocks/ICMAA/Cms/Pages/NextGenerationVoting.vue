<template>
  <div class="t-bg-white">
    <!-- Header -->
    <div>
      <picture-component
        :src="headerImage.src"
        :width="headerImage.width"
        :height="headerImage.height"
        :sizes="headerImage.sizes"
        :placeholder="true"
        :ratio="`${headerImage.width}:${headerImage.height}`"
        :alt="headerImage.alt | htmlDecode"
      />
    </div>

    <!-- Infotext -->
    <div class="t-container t-w-3/4 t-text-center md:t-w-1/2">
      <h2
        class="t-m-5 t-text-xl t-uppercase t-text-black"
        v-html="content.info.headline"
      />
      <p v-html="content.info.text" />
    </div>

    <!-- VotingGrid -->
    <div class="t-container t-flex t-flex-wrap">
      <div
        v-for="voting in votings"
        :key="voting.name"
        class="t-mt-4 t-w-1/2 t-self-center t-p-4 t-text-center md:t-w-1/4"
      >
        <div class="t-relative">
          <picture-component
            :src="voting.img.src"
            :width="voting.img.width"
            :height="voting.img.height"
            :sizes="voting.img.sizes"
            :placeholder="true"
            :ratio="`${voting.img.width}:${voting.img.height}`"
            :alt="voting.img.alt | htmlDecode"
            class="t-w-full"
          />
          <div
            v-if="voting.votes"
            class="t-absolute t-bottom-0 t-left-0 t-z-1 t-flex t-h-10 t-w-10 t-flex-wrap t-content-center t-items-center t-justify-center t-bg-base-lighter t-text-white lg:t-h-12 lg:t-w-12"
          >
            <div
              class="t-font-bold t-leading-none"
              v-text="voting.votes"
            />
            <div class="t-text-xs t-leading-none">
              {{ $t('Votes') }}
            </div>
          </div>
        </div>
        <div
          v-if="voting.video"
          class="t-relative t-mt-1 t-w-full t-bg-white"
          style="padding-top: 56.25%"
        >
          <iframe
            class="t-absolute t-top-0"
            width="100%"
            height="100%"
            :src="voting.video"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
        <div class="t-my-4">
          <span
            class="t-grow t-pt-4 t-text-sm t-leading-tight t-text-primary"
            v-text="voting.name"
          />
          <a
            :href="voting.link"
            target="_blank"
            :title="voting.name | htmlDecode"
            class="t-ml-4 t-align-text-bottom"
          >
            <material-icon
              :icon="voting.icon"
              icon-set="icmaa"
              size="xs"
              class="t-align-text-bottom"
            />
          </a>
        </div>
      </div>
    </div>

    <!-- Bottomtext -->
    <div class="t-container t-mb-8 t-w-3/4 t-text-center md:t-w-1/2">
      <h2
        class="t-m-5 t-text-xl t-uppercase t-text-black"
        v-html="content.bottom.headline"
      />
      <p v-html="content.bottom.text" />
    </div>

    <!-- Add powr.io Poll -->
    <div v-if="content.powr_id">
      <div
        :id="content.powr_id"
        class="powr-poll"
      />
      <script
        type="application/javascript"
        src="https://www.powr.io/powr.js?platform=html"
      />
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import PictureComponent from 'theme/components/core/blocks/Picture'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'NextGenerationVoting',
  components: {
    PictureComponent,
    MaterialIcon
  },
  mixins: [ Page ],
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    headerImage () {
      return this.content.header.img
    },
    votings () {
      return this.content.votings.map(c => {
        const imageDefaults = {
          alt: c.name,
          width: 600,
          height: 600,
          sizes: [
            { media: 'xs', width: 450 },
            { width: 300 }
          ]
        }

        c.img = Object.assign(imageDefaults, c.img)
        return c
      })
    }
  }
}
</script>

<template>
  <div class="t-bg-white">
    <!-- Header -->
    <div>
      <picture-component :src="headerImage.src" :width="headerImage.width" :height="headerImage.height" :sizes="headerImage.sizes" :placeholder="true" :ratio="`${headerImage.width}:${headerImage.height}`" :alt="headerImage.alt | htmlDecode" />
    </div>

    <!-- Infotext -->
    <div class="t-container t-text-center t-w-3/4 md:t-w-1/2">
      <h2 class="t-text-black t-m-5 t-uppercase t-text-xl" v-html="content.info.headline" />
      <p v-html="content.info.text" />
    </div>

    <!-- VotingGrid -->
    <div class="t-container t-flex t-flex-wrap">
      <div v-for="voting in votings" :key="voting.name" class="t-w-1/2 t-text-center md:t-w-1/4 t-p-4 t-self-center t-mt-4">
        <div class="t-relative">
          <picture-component :src="voting.img.src" :width="voting.img.width" :height="voting.img.height" :sizes="voting.img.sizes" :placeholder="true" :ratio="`${voting.img.width}:${voting.img.height}`" :alt="voting.img.alt | htmlDecode" class="t-w-full" />
          <div v-if="voting.votes" class="t-text-white t-flex t-flex-wrap t-content-center t-w-10 t-h-10 lg:t-w-12 lg:t-h-12 t-bg-base-lighter t-items-center t-justify-center t-absolute t-bottom-0 t-left-0 t-z-1">
            <div v-text="voting.votes" class="t-font-bold t-leading-none" />
            <div class="t-leading-none t-text-xs">{{ $t('Votes') }}</div>
          </div>
        </div>
        <div v-if="voting.video" class="t-relative t-w-full t-bg-white t-mt-1" style="padding-top: 56.25%">
          <iframe class="t-absolute t-top-0" width="100%" height="100%" :src="voting.video" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
        </div>
        <div class="t-my-4">
          <span class="t-flex-grow t-text-sm t-text-primary t-leading-tight t-pt-4" v-text="voting.name" />
          <a :href="voting.link" target="_blank" :title="voting.name | htmlDecode" class="t-ml-4 t-align-text-bottom">
            <material-icon :icon="voting.icon" icon-set="icmaa" size="xs" class="t-align-text-bottom" />
          </a>
        </div>
      </div>
    </div>

    <!-- Bottomtext -->
    <div class="t-container t-text-center t-w-3/4 md:t-w-1/2 t-mb-8">
      <h2 class="t-text-black t-m-5 t-uppercase t-text-xl" v-html="content.bottom.headline" />
      <p v-html="content.bottom.text" />
    </div>

    <!-- Add powr.io Poll -->
    <div v-if="content.powr_id">
      <div class="powr-poll" :id="content.powr_id" />
      <script type="application/javascript" src="https://www.powr.io/powr.js?platform=html" />
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import PictureComponent from 'theme/components/core/blocks/Picture'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'NextGenerationVoting',
  mixins: [ Page ],
  components: {
    PictureComponent,
    MaterialIcon
  },
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
            { media: '(min-width: 415px)', width: 450 },
            { media: '(max-width: 414px)', width: 300 }
          ]
        }

        c.img = Object.assign(imageDefaults, c.img)
        return c
      })
    }
  }
}
</script>

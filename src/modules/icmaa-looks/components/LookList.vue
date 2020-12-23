<template>
  <div class="t--mx-2 t-flex t-flex-wrap">
    <div v-for="look in looksList" :key="`look-list-${look.uid}`" class="t-w-1/2 md:t-w-1/4 t-px-2 t-mb-4">
      <router-link :to="localizedRoute({ name: 'icmaa-looks-detail', params: { identifier: look.identifier }})" :title="look.title | htmlDecode">
        <picture-component :src="look.image" :width="imageWidth" :height="imageHeight" :sizes="imageSizes" :placeholder="true" :ratio="`${imageWidth}:${imageHeight}`" :alt="look.title | htmlDecode" />
      </router-link>
    </div>
    <div class="t-w-full t-flex t-items-center t-justify-center t-mb-8" v-if="!finalPage">
      <button-component type="ghost" @click.native="loadMore" :disabled="loading" class="t-w-2/3 lg:t-w-1/4" :class="{ 't-relative t-opacity-60': loading }">
        {{ $t('Load more') }}
        <loader-background v-if="loading" bar="t-bg-base-darkest" class="t-bottom-0" />
      </button-component>
    </div>
  </div>
</template>

<script>
import config from 'config'

import PictureComponent from 'theme/components/core/blocks/Picture'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'

export default {
  name: 'LookList',
  props: {
    looks: {
      type: [Array],
      required: true
    },
    perPage: {
      type: Number,
      default: 4
    }
  },
  components: {
    PictureComponent,
    ButtonComponent,
    LoaderBackground
  },
  data () {
    return {
      page: 1,
      loading: false,
      finalPage: false
    }
  },
  computed: {
    looksList () {
      return this.looks.slice(0, this.page * this.perPage)
    },
    imageWidth () {
      return config.products.thumbnails.width
    },
    imageHeight () {
      return config.products.thumbnails.height
    },
    imageSizes () {
      return [
        { media: '(min-width: 1280px)', width: 360 },
        { media: '(min-width: 1024px)', width: 236 },
        { media: '(min-width: 415px)', width: 364 },
        { media: '(max-width: 414px)', width: 188 }
      ]
    }
  },
  methods: {
    async loadMore () {
      if (this.loading === true) {
        return
      }

      const page = this.page + 1
      const size = this.perPage

      this.loading = true
      await this.$store.dispatch('icmaaLooks/list', { page, size })
        .then(items => {
          this.page = this.page + 1
          this.loading = false

          if (items.length === 0 || items.length < size) {
            this.finalPage = true
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

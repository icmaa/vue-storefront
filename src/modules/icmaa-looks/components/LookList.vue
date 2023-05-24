<template>
  <div class="t--mx-2 t-flex t-flex-wrap">
    <div
      v-for="look in looksList"
      :key="`look-list-${look.uid}`"
      class="t-mb-4 t-w-1/2 t-px-2 md:t-w-1/4"
    >
      <router-link
        :to="localizedRoute({ name: 'icmaa-looks-detail', params: { identifier: look.identifier }})"
        :title="look.title | htmlDecode"
      >
        <picture-component
          :src="look.image"
          :width="imageWidth"
          :height="imageHeight"
          :sizes="imageSizes"
          :placeholder="true"
          :ratio="`${imageWidth}:${imageHeight}`"
          :alt="look.title | htmlDecode"
        />
      </router-link>
    </div>
    <div
      v-if="!finalPage"
      class="t-mb-8 t-flex t-w-full t-items-center t-justify-center"
    >
      <button-component
        type="ghost"
        :disabled="loading"
        class="t-w-2/3 lg:t-w-1/4"
        :class="{ 't-relative t-opacity-60': loading }"
        @click.native="loadMore"
      >
        {{ $t('Load more') }}
        <loader-background
          v-if="loading"
          bar="t-bg-base-darkest"
          class="t-bottom-0"
        />
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
  components: {
    PictureComponent,
    ButtonComponent,
    LoaderBackground
  },
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
        { media: 'xl', width: 360 },
        { media: 'lg', width: 236 },
        { media: 'xs', width: 364 },
        { width: 188 }
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

<template>
  <div>
    <a
      v-for="(shareUrl, key) in shareUrls"
      :key="key"
      :href="shareUrl"
      target="_blank"
      rel="noopener noreferrer"
      :title="key | capitalize"
      class="t-text-base-light"
      :class="{ 't-mr-4': key !== lastKey }"
    >
      <MaterialIcon
        icon-set="icmaa"
        :icon="key"
        size="sm"
      />
    </a>
  </div>
</template>

<script>
import { icmaa_meta } from 'config'
import { isServer } from '@vue-storefront/core/helpers'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'WebShare',
  components: {
    MaterialIcon
  },
  props: {
    webshareText: {
      type: String,
      required: true
    },
    webshareImage: {
      type: String,
      default: ''
    }
  },
  computed: {
    url () {
      if (isServer) {
        return encodeURIComponent(icmaa_meta?.base_url + this.$route.fullPath)
      }
      return encodeURIComponent(window.location.href)
    },
    text () {
      return encodeURIComponent(this.webshareText)
    },
    image () {
      return encodeURIComponent(this.webshareImage)
    },
    shareUrls () {
      return {
        'twitter': `https://twitter.com/intent/tweet/?text=${this.text}&amp;url=${this.url}`,
        'pinterest': `https://pinterest.com/pin/create/button/?url=${this.url}&amp;media=${this.image}&amp;description=${this.text}`,
        'telegram': `https://t.me/share/url?url=${this.url}&amp;text=${this.text}`,
        'whatsapp': `whatsapp://send?text=${this.url}%20${this.text}`
      }
    },
    lastKey () {
      return Object.keys(this.shareUrls)[Object.keys(this.shareUrls).length - 1]
    }
  }
}
</script>

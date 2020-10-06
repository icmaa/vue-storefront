<template>
  <div class="t-flex-auto t-px-4 t-mb-4 lg:t-mb-6" data-test-id="LogoLineSelf">
    <!-- Logos -->
    <div class="t-flex t-flex-wrap t-justify-between t--mx-2">
      <div v-for="(logo, index) in content.logos" :key="index" class="t-flex-fix t-px-2 t-w-1/3 md:t-w-1/6 lg:t-w-1/4 t-pb-2">
        <router-link :to="localizedRoute(logo.link)" class="t-flex t-justify-center t-px-4 t-py-2 t-bg-white">
          <img :src="getMediaThumbnail(logo.img, 0, 0)" :srcset="`${getMediaThumbnail(logo.img, 0, 0)} 1x, ${getMediaThumbnail(logo.img2x, 0, 0)} 2x`" :alt="logo.name" :title="logo.name">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoLineSelf',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>

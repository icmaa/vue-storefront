<template>
  <router-link
    :to="link"
    :title="alt"
    data-test-id="DepartmentLogo"
    @click.native="setCluster"
  >
    <img
      :src="url"
      :srcset="`${url} 1x, ${retinaUrl} 2x`"
      :alt="alt"
      width="74"
      height="38"
    >
  </router-link>
</template>

<script>
export default {
  name: 'DepartmentLogo',
  props: {
    url: {
      type: String,
      required: true
    },
    retinaUrl: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    link: {
      type: [String, Object],
      required: true
    },
    cluster: {
      type: [String, Boolean],
      default: false
    }
  },
  methods: {
    setCluster () {
      this.$store.dispatch('user/setCluster', { value: this.cluster })
    }
  }
}
</script>

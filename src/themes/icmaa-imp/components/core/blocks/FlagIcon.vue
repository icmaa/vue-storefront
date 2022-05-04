<template>
  <svg>
    <use :xlink:href="`${sprite}#${isoFileCode}`" />
  </svg>
</template>

<script>

const flagSprites = {
  '1x1': require(`theme/assets/flags/1x1.svg`),
  '4x3': require(`theme/assets/flags/4x3.svg`)
}

export default {
  props: {
    iso: {
      type: String,
      required: true
    },
    format: {
      type: String,
      default: '1x1',
      validator: function (value) {
        return ['1x1', '4x3'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    attributes () {
      return this.$attrs
    },
    sprite () {
      return flagSprites[this.format]
    },
    isoFileCode () {
      return this.iso.toLowerCase()
    }
  }
}
</script>

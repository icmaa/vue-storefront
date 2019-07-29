<template>
  <i class="material-icons" :class="[ sizeClass ]">{{ icon }}</i>
</template>

<script>
export default {
  name: 'MaterialIcon',
  props: {
    icon: {
      type: String,
      default: 'favorite_border'
    },
    size: {
      type: String,
      default: 'md',
      validation: (value) => {
        return ['xs', 'md', 'lg', 'xl'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    sizeClass () {
      const map = {
        'xs': 't-text-lg',
        'md': 't-text-2xl',
        'lg': 't-text-4xl',
        'xl': 't-text-5xl'
      }

      return map[this.size]
    }
  }
}
</script>

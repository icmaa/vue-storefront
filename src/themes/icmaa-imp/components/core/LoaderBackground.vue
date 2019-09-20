<template>
  <div class="loader t-absolute t-left-0 t-w-full" :class="[ background, height] ">
    <div class="bar t-w-full t-h-full" />
  </div>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    background: {
      type: String,
      default: 't-bg-transparent'
    },
    height: {
      type: String,
      default: 't-h-1/8'
    }
  }
}
</script>

<style lang="scss" scoped>

.loader {
  .bar {
    background: linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%);
    animation: roller 25s linear infinite;
  }
}

@keyframes roller {
  from {  background-position: 0 0    }
  to   {  background-position: 10000px 0 }
}

</style>

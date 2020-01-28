<template>
  <nav role="service-navigation">
    <ul>
      <li class="t-w-full t-relative">
        <a class="t-block lg:t-hidden t-bg-white t-border-black t-border t-p-2 t-appearance-none focus:outline-none focus:shadow-outline" href="#">Service
          <div class="t-pointer-events-none t-absolute t-inset-y-0 t-right-0 t-flex t-items-center t-px-2"><i class="material-icons t-text-2xl">keyboard_arrow_down</i></div>
        </a>
        <ul class="t-hidden lg:t-block t-bg-white lg:t-bg-transparent t-absolute lg:t-relative t-w-full t-z-10">
          <li v-for="(item, index) in navigation" :key="index" class="t-border-b t-border-base-lighter">
            <router-link :to="localizedRoute(item.path)" class="t-flex t-p-2 t-text-sm">
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ServiceNavigation',
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getJsonBlockByIdentifier']),
    block () {
      return this.getJsonBlockByIdentifier('service-navigation')
    },
    navigation () {
      return this.block.navigation || []
    }
  }
}
</script>

<style lang="scss" scoped>
/* Display the ServiceNav on hover and tap*/
ul li a:hover + .t-hidden, .t-hidden:hover {
    display: block;
}
</style>

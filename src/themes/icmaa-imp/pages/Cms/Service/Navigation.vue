<template>
  <nav role="service-navigation">
    <ul>
      <li class="t-relative t-w-full">
        <a
          class="focus:outline-none focus:ring t-block t-cursor-pointer t-appearance-none t-border t-border-base-light t-bg-white t-px-3 t-py-2 t-text-black lg:t-hidden"
          @click="toggleView"
        >Service
          <div class="t-pointer-events-none t-absolute t-inset-y-0 t-right-0 t-flex t-items-center t-px-2"><i class="material-icons t-text-2xl">keyboard_arrow_down</i></div>
        </a>
        <ul class="t-relative t-hidden t-w-full lg:t-block lg:t-bg-transparent">
          <li
            v-for="(item, index) in navigation"
            :key="index"
            class="t-border-b t-border-base-lighter"
          >
            <router-link
              :to="localizedRoute(item.path)"
              class="t-flex t-px-3 t-py-2 t-text-sm t-text-black"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
        <ul
          v-if="show"
          class="t-absolute t-z-10 t-w-full t-border-x t-border-base-light t-bg-white lg:t-hidden"
        >
          <li
            v-for="(item, index) in navigation"
            :key="index"
            class="t-border-b t-border-base-light"
            @click="toggleView"
          >
            <router-link
              :to="localizedRoute(item.path)"
              class="t-flex t-px-3 t-py-2 t-text-sm t-text-black"
            >
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
  data () {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getJsonBlockByIdentifier']),
    block () {
      return this.getJsonBlockByIdentifier('service-navigation')
    },
    navigation () {
      return this.block.navigation || []
    }
  },
  methods: {
    toggleView () {
      this.show = !this.show
      this.$emit('toggle', this.show)
    }
  }
}
</script>

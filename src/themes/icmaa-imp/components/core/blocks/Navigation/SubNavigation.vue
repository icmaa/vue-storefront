<template>
  <div>
    <gender-navigation :items="genderNavigationItems" class="t--mx-4 t--mt-4 t-mb-4" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GenderNavigation from 'theme/components/core/blocks/Navigation/ClusterNavigation'

export default {
  components: {
    GenderNavigation
  },
  computed: {
    ...mapGetters({
      'getJsonBlockByIdentifier': 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    mainNavigation () {
      return this.getJsonBlockByIdentifier('navigation-main')
    },
    mainNavigationItems () {
      return this.mainNavigation.mainNavigation
    },
    genderNavigationItems () {
      return this.mainNavigation.genderNavigation
    }
  }
}

</script>

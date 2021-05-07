<template>
  <div>
    <gender-navigation :items="genderNavigationItems" class="t--mx-4 t--mt-4 t-mb-4" />
    {{ subNavigation }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GenderNavigation from 'theme/components/core/blocks/Navigation/ClusterNavigation'

export default {
  name: 'SubNavigation',
  components: {
    GenderNavigation
  },
  props: {
    subNavigationKey: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      'getJsonBlockByIdentifier': 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    navigation () {
      return this.getJsonBlockByIdentifier('navigation-main')
    },
    genderNavigationItems () {
      return this.navigation.genderNavigation
    },
    subNavigation () {
      return this.navigation.subNavigation[this.subNavigationKey] || false
    }
  }
}

</script>

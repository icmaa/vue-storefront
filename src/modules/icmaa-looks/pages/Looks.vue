<template>
  <div class="t-container t-p-4">
    <h1
      v-if="!isDetail"
      class="t-mb-4 t-ml-4 t-mt-2 t-text-1xl t-font-normal t-text-primary"
    >
      {{ $t('Look of the week') }}
    </h1>
    <Look
      v-if="current"
      :look="current"
    />
    <h2 class="t-mb-4 t-text-1xl t-font-normal">
      {{ $t('More looks') }}
    </h2>
    <LookList
      :looks="looks"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Look from 'icmaa-looks/components/Look'
import LookList from 'icmaa-looks/components/LookList'

export default {
  name: 'Looks',
  components: {
    Look,
    LookList
  },
  async asyncData ({ store, route }) {
    const identifier = route.params.identifier
    if (identifier && !store.getters['icmaaLooks/getByIdentifier'](identifier)) {
      await store.dispatch('icmaaLooks/single', { value: identifier })
    }

    const { perPage } = this.data()
    if (store.getters['icmaaLooks/getLooks'].length < perPage) {
      await store.dispatch('icmaaLooks/list', { size: perPage })
    }
  },
  data () {
    return {
      perPage: 8
    }
  },
  computed: {
    ...mapGetters({
      looks: 'icmaaLooks/getLooks',
      lookByIdentifier: 'icmaaLooks/getByIdentifier'
    }),
    isDetail () {
      return !!this.$route.params.identifier
    },
    current () {
      const identifier = this.$route.params.identifier
      if (identifier) {
        return this.lookByIdentifier(identifier)
      }

      return this.looks[0]
    }
  }
}
</script>

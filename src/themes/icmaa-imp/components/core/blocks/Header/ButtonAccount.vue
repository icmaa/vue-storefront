<template>
  <ButtonIcon
    icon="person"
    :title="title"
    :class="[ isLoggedIn ? 'logged-in' : 'logged-out']"
    @click="toggleAccount"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonIcon from 'theme/components/core/blocks/Header/ButtonIcon'

export default {
  name: 'ButtonAccount',
  components: {
    ButtonIcon
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    title () {
      return this.isLoggedIn ? 'My Account' : 'Login'
    }
  },
  methods: {
    toggleAccount () {
      if (!this.isLoggedIn) {
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else {
        this.$store.dispatch('ui/setUserSidebar', { active: true, appear: false })
      }
    }
  }
}
</script>

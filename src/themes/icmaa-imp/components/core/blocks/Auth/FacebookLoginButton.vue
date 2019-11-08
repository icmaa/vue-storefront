<template>
  <button-component type="facebook" icon="facebook" icon-set="icmaa" icon-position="left">
    {{ $t('Login with Facebook') }}
  </button-component>
</template>

<script>
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'FacebookLoginButton',
  components: {
    ButtonComponent
  },
  data () {
    return {
      appId: 103608836440301,
      loginOptions: { scope: 'email', return_scopes: true }
    }
  },
  methods: {
    fbSdkInit (response) {
      console.log(response)
    },
    fbLogin (response, test) {
      console.log(response, test)
    },
    fbConnect (response) {
      console.log(response)
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: this.$t('You are logged in!'),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>

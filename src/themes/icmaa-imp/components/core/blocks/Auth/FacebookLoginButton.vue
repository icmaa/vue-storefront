<template>
  <button-component v-if="visible" type="facebook" :icon="working ? '' : 'facebook'" icon-set="icmaa" icon-position="left" :disabled="disabled" :class="{ 't-relative': working }" @click="toggleLogin">
    <template v-if="!connected">
      {{ $t(initialText) }}
    </template>
    <template v-else-if="working">
      {{ $t('Please wait') }}
    </template>
    <template v-else>
      {{ $t('Logout of Facebook') }}
    </template>
    <loader-background v-if="working" bar="t-bg-white t-opacity-50" class="t-bottom-0" />
  </button-component>
</template>

<script>
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'

export default {
  name: 'FacebookLoginButton',
  props: {
    initialText: {
      type: String,
      default: 'Login with Facebook'
    },
    hideConnected: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ButtonComponent,
    LoaderBackground
  },
  data () {
    return {
      appId: '103608836440301',
      version: 'v5.0',
      loginOptions: { scope: 'email,user_birthday,user_gender', return_scopes: true },
      fields: 'first_name,last_name,email,birthday,gender',
      options: {},
      working: false,
      connected: false
    }
  },
  created () {
    const created = new Promise(async resolve => {
      const { appId, version, options } = this
      const sdk = await this.getFbSdk({ appId, version, options })
      const fbLoginStatus = await this.getFbLoginStatus()
      if (fbLoginStatus.status === 'connected') {
        this.connected = true
      }
      this.$emit('sdk-init', { FB: sdk })
      resolve()
    })
    this.doAsync(created)
  },
  computed: {
    visible () {
      return !(this.connected && this.hideConnected)
    },
    disabled () {
      return this.working === true
    }
  },
  methods: {
    onLogin (response) {
      if (this.connected) {
        const { fields } = this
        const { accessToken } = response.authResponse
        window.FB.api('/me', { accessToken, fields }, (r) => {
          console.log(r)
        })
      }
    },
    toggleLogin () {
      this.$emit('click')
      if (this.connected) {
        this.logout()
      } else {
        this.login()
      }
    },
    async login () {
      const login = this.fbLogin(this.loginOptions)
      const response = await this.doAsync(login)

      this.connected = (response.status === 'connected')
      this.$emit('login', response)
      this.onLogin(response)

      return login
    },
    async logout () {
      const logout = this.fbLogout()
      const response = await this.doAsync(logout)

      this.connected = false
      this.$emit('logout', response)

      return logout
    },
    async doAsync (promise) {
      this.working = true
      await promise
      this.working = false

      return promise
    },
    async initFbSdk (options) {
      return new Promise(resolve => {
        window.fbAsyncInit = function () {
          const defaults = { cookie: true, xfbml: true }
          options = { ...defaults, ...options }
          window.FB.init(options)
          resolve()
        };
        (function (d, s, id) {
          const fjs = d.getElementsByTagName(s)[0]
          if (d.getElementById(id)) { return; }
          const js = d.createElement(s); js.id = id
          js.src = '//connect.facebook.net/en_US/sdk.js'
          fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))
      })
    },
    async getFbSdk (options) {
      return new Promise(async resolve => {
        if (window.FB) {
          resolve(window.FB)
        } else {
          await this.initFbSdk(options)
          resolve(window.FB)
        }
      })
    },
    async fbLogin (options) {
      return new Promise(resolve => {
        window.FB.login(response => resolve(response), options)
      })
    },
    async getFbLoginStatus () {
      return new Promise(resolve => {
        window.FB.getLoginStatus(response => resolve(response))
      })
    },
    async fbLogout () {
      return new Promise(resolve => {
        window.FB.logout(response => resolve(response))
      })
    }
  }
}
</script>

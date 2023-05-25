<template>
  <Modal
    name="modal-signup"
    :title="$t(title)"
    :width="width"
    @close="onClose"
  >
    <Login v-if="activeElem === 'login'" />
    <Register v-if="activeElem === 'register'" />
    <ForgotPass v-if="activeElem === 'forgot-pass'" />
  </Modal>
</template>

<script>
import { mapState } from 'vuex'
import Modal from 'theme/components/core/Modal'

const Login = () => import(/* webpackChunkName: "vsf-login" */ 'theme/components/core/blocks/Auth/Login')
const Register = () => import(/* webpackChunkName: "vsf-register" */ 'theme/components/core/blocks/Auth/Register')
const ForgotPass = () => import(/* webpackChunkName: "vsf-forgotpass" */ 'theme/components/core/blocks/Auth/ForgotPass')

export default {
  name: 'AuthModal',
  components: {
    Modal,
    Login,
    Register,
    ForgotPass
  },
  computed: {
    ...mapState({
      activeElem: state => state.ui.authElem
    }),
    title () {
      if (this.activeElem === 'register') {
        return 'Register'
      } else if (this.activeElem === 'forgot-pass') {
        return 'Reset password'
      }

      return 'Login'
    },
    width () {
      if (this.activeElem === 'register') {
        return 600
      }

      return 400
    }
  },
  methods: {
    onClose () {
      this.$store.commit('ui/setAuthElem', 'login')
      localStorage.removeItem('redirect')
    }
  }
}
</script>

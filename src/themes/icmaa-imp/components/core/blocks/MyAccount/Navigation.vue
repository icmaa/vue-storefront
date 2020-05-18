<template>
  <nav data-test-id="MyAccountNavigation">
    <div class="t-flex t-flex-wrap t-bg-white">
      <div class="t-flex t-flex-expand t-px-6 t-py-6">
        <material-icon icon="account_circle" size="xl" class="t-mr-3 t-text-primary" />
        <div class="t-leading-1-rem t-mt-2">
          <div class="t-text-xl t-font-bold">
            {{ welcome }}
          </div>
          <router-link :to="localizedRoute('/my-account')" @click.native="$emit('click')" class="t-text-xs t-text-base-light">
            {{ $t('Edit profile') }}
          </router-link>
        </div>
      </div>
      <ul @click="$emit('click')" class="t-flex t-flex-wrap t-overflow-hidden" :class="[ visible ? 't-pt-3 t-max-h-screen-100 lg:t-border-none' : 't-max-h-0' ]" style="transition: all .5s">
        <li class="t-flex t-w-full" v-for="(page, index) in navigation" :key="index">
          <router-link @click.native="onClick" :to="localizedRoute(page.link)" class="t-flex t-flex-grow t-items-center t-px-6 t-py-2 t-text-sm t-text-base-tone" :data-test-id="page.testId">
            <button-component icon="arrow_forward" type="select" class="t-w-full">
              {{ page.title }}
            </button-component>
          </router-link>
        </li>
        <li class="t-flex t-w-full t-pt-3">
          <router-link :to="localizedRoute('')" @click.native="logout" class="t-flex t-flex-grow t-items-center t-text-sm t-px-6 t-pb-6 t-text-base-light" data-test-id="logoutButton">
            <button-component type="second" class="t-w-full">
              {{ $t('Logout') }}
            </button-component>
          </router-link>
        </li>
      </ul>
      <div v-if="accordion" class="t-flex lg:t-hidden t-w-full t-py-3 t-items-center t-justify-center t-text-sm t-text-base-light t-cursor-pointer" @click="visible = !visible">
        {{ $t('Swap navigation') }}
        <material-icon :icon="visible ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" size="sm" class="t-ml-4" />
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MyAccountNavigation',
  data () {
    return {
      visible: !this.accordion,
      navigation: [
        { title: this.$t('My profile'), icon: 'account_circle', link: '/my-account', testId: 'MyAccountButton' },
        { title: this.$t('My orders'), icon: 'local_mall', link: '/my-account/orders', testId: 'MyOrdersButton' },
        { title: this.$t('My addresses'), icon: 'home', link: '/my-account/addresses', testId: 'MyAddressesButton' },
        { title: this.$t('My newsletter'), icon: 'mail', link: '/my-account/newsletter', testId: 'MyNewsletterButton' },
        { title: this.$t('My product-alerts'), icon: 'alarm_on', link: '/my-account/product-alerts', testId: 'MyProductAlertsButton' },
        { title: this.$t('My coupons'), icon: 'receipt', link: '/my-account/coupons', testId: 'MyCouponsButton' }
      ]
    }
  },
  components: {
    MaterialIcon,
    ButtonComponent
  },
  props: {
    accordion: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport',
      customer: 'user/getCustomer'
    }),
    firstname () {
      return this.customer && this.customer.firstname ? this.customer.firstname : false
    },
    welcome () {
      return this.firstname ? i18n.t('Hi {firstname}', { firstname: this.firstname }) : i18n.t('Your account')
    }
  },
  methods: {
    isActive (link) {
      return this.$route.path.endsWith(link)
    },
    logout () {
      this.$store.dispatch('user/logout', { silent: false })
        .then(() => {
          this.$router.push(this.localizedRoute('/'))
        })
    },
    onClick () {
      if (this.accordion && ['xs', 'sm'].includes(this.viewport)) {
        this.visible = false
      }
    }
  },
  watch: {
    viewport (v) {
      this.visible = !['xs', 'sm'].includes(v)
    }
  }
}
</script>

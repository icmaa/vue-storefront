<template>
  <nav
    data-test-id="MyAccountNavigation"
    class="t-max-w-full"
  >
    <div class="t-flex t-flex-wrap t-bg-white">
      <div class="t-flex t-flex-expand t-p-6">
        <MaterialIcon
          icon="account_circle"
          size="xl"
          class="t-mr-3 t-text-primary"
        />
        <div class="t-mt-2 t-leading-1-rem">
          <div class="t-text-xl t-font-bold">
            {{ welcome }}
          </div>
          <router-link
            :to="localizedRoute('/my-account')"
            class="t-text-xs t-text-base-light"
            @click.native="$emit('click')"
          >
            {{ $t('Edit profile') }}
          </router-link>
        </div>
      </div>
      <ul
        class="t-flex t-flex-wrap t-overflow-hidden"
        :class="[ visible ? 't-max-h-screen-100 lg:t-border-none' : 't-max-h-0' ]"
        style="transition: all .5s"
        @click="$emit('click')"
      >
        <li
          v-for="(page, index) in navigation"
          :key="index"
          class="t-flex t-w-full"
        >
          <router-link
            :to="localizedRoute(page.link)"
            class="t-flex t-grow t-items-center t-px-6 t-pb-4 t-text-sm t-text-base-tone"
            :data-test-id="page.testId"
            @click.native="onClick"
          >
            <ButtonComponent
              icon="arrow_forward"
              type="select"
              class="t-w-full"
            >
              {{ page.title }}
            </ButtonComponent>
          </router-link>
        </li>
        <li class="t-flex t-w-full t-pt-2">
          <router-link
            :to="localizedRoute('')"
            class="t-flex t-grow t-items-center t-px-6 t-pb-6 t-text-sm t-text-base-light"
            data-test-id="logoutButton"
            @click.native="logout"
          >
            <ButtonComponent
              type="second"
              class="t-w-full"
            >
              {{ $t('Logout') }}
            </ButtonComponent>
          </router-link>
        </li>
      </ul>
      <div
        v-if="accordion"
        class="t-flex t-w-full t-cursor-pointer t-items-center t-justify-center t-py-3 t-text-sm t-text-base-light lg:t-hidden"
        @click="visible = !visible"
      >
        {{ $t('Swap navigation') }}
        <MaterialIcon
          :icon="visible ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          size="sm"
          class="t-ml-4"
        />
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
  data () {
    return {
      visible: !this.accordion,
      navigation: [
        { title: this.$t('My profile'), link: '/my-account', testId: 'MyAccountButton' },
        { title: this.$t('My orders'), link: '/my-account/orders', testId: 'MyOrdersButton' },
        { title: this.$t('My addresses'), link: '/my-account/addresses', testId: 'MyAddressesButton' },
        { title: this.$t('My newsletter'), link: '/my-account/newsletter', testId: 'MyNewsletterButton' },
        { title: this.$t('My product-alerts'), link: '/my-account/product-alerts', testId: 'MyProductAlertsButton' },
        { title: this.$t('My coupons'), link: '/my-account/coupons', testId: 'MyCouponsButton' }
      ]
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
  watch: {
    viewport (v) {
      this.visible = !['xs', 'sm'].includes(v)
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('user/logout', { silent: false })
        .then(() => {
          this.$router.push(this.localizedHomeRoute)
        })
    },
    onClick () {
      if (this.accordion && ['xs', 'sm'].includes(this.viewport)) {
        this.visible = false
      }
    }
  }
}
</script>

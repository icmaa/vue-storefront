<template>
  <transition name="fade" appear>
    <div class="cookie t-absolute t-bottom-0 t-z-10 t-w-full t-h-full" v-if="isOpen" data-test-id="CookieNotification">
      <div class="t-container t-bg-white t-w-10/12 t-my-10">
        <div class="t-flex t-flex-col t-items-center t-p-8 t-text-sm">
          <div class="t-w-full t-text-lg t-leading-tight t-text-black t-font-bold t-py-4">
            Cookie-Einstellungen
          </div>
          <p class="t-px-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi ad exercitationem minus, odit blanditiis, ipsum distinctio asperiores quod dolorum voluptate natus ipsa ex porro suscipit nemo reiciendis, dolor odio. Aperiam?
          </p>
          <div class="t-self-start t-flex t-items-center t-mb-4 t-px-2">
            <material-icon icon="arrow_forward" />
            <a class="t-text-black t-text-sm t-font-bold">Datenschutzerklärung</a>
          </div>

          <!-- Checkboxes -->
          <div class="t-flex t-text-lg t-items-center t-justify-center t-mb-4">
            <input type="checkbox" class="t-mr-2" disabled checked><label class="t-mr-2">Notwendig</label>
            <input type="checkbox" class="t-mr-2"><label class="t-mr-2">Marketing</label>
          </div>

          <div class="t-self-start t-flex t-items-center">
            <material-icon icon="arrow_forward" />
            <a class="t-text-black t-font-bold">Impressum</a>
          </div>

          <!-- Details -->
          <div class="t-self-end t-flex t-items-center t-mb-4" @click="showDetails = !showDetails">
            <a class="t-text-black t-font-bold">Details</a>
            <material-icon :icon="showDetails ? 'expand_less' : 'expand_more'" />
          </div>

          <div v-show="showDetails" class="t-mb-4">
            <h2 class="t-font-bold">
              Notwendig
            </h2>
            <p class="t-mb-4">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam temporibus porro, voluptatem fugit, minus tempora quaerat dolor alias ab reprehenderit laboriosam ut cupiditate omnis. Quidem mollitia vitae voluptatum aut culpa!
            </p>
            <h2 class="t-font-bold">
              Marketing und Statistik-Cookies
            </h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam temporibus porro, voluptatem fugit, minus tempora quaerat dolor alias ab
              reprehenderit laboriosam ut cupiditate omnis. Quidem mollitia vitae voluptatum aut culpa! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam
              temporibus porro, voluptatem fugit, minus tempora quaerat dolor alias ab reprehenderit laboriosam ut cupiditate omnis. Quidem mollitia vitae voluptatum aut culpa!
            </p>
          </div>

          <!-- Buttons -->
          <button-component size="md" type="alt-3" class="t-w-full t-mb-4" @click="accept">
            {{ $t('Accept') }}
          </button-component>
          <button-component size="md" type="ghost" class="t-w-full" @click="$router.push(localizedRoute(detailsLink))">
            Auswahl bestätigen
          </button-component>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import ButtonComponent from 'theme/components/core/blocks/Button'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'CookieNotification',
  components: {
    ButtonComponent,
    MaterialIcon
  },
  props: {
    detailsLinkText: {
      type: String,
      default: i18n.t('See details')
    },
    detailsLink: {
      type: String,
      default: '/service-imprint'
    },
    message: {
      type: String,
      default: i18n.t('We are using cookies to give you the best experience on our site.')
    },
    messageSub: {
      type: String,
      default: i18n.t('By continuing to use our website without changing the settings, you are agreeing to our use of cookies.')
    }
  },
  data () {
    return {
      isOpen: false,
      showDetails: false
    }
  },
  methods: {
    accept () {
      this.setVisited()
      this.isOpen = false
    },
    async setVisited () {
      await this.$store.dispatch('claims/set', { claimCode: 'cookiesAccepted', value: true })
      this.$bus.$emit('cookiesAccepted', true)
    }
  },
  created () {
    this.$store.dispatch('claims/check', { claimCode: 'cookiesAccepted' }).then((cookieClaim) => {
      if (!cookieClaim) {
        this.isOpen = true
        this.$store.dispatch('claims/set', { claimCode: 'cookiesAccepted', value: false })
      } else {
        this.isOpen = !cookieClaim.value
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.cookie {
  background-color: rgba(0,0,0,.4);
  top: 0;
  left: 0;
}
.t-container {
  width: 80%;
}
</style>

import { Logger } from '@vue-storefront/core/lib/logger'
import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'

declare const Frames: any

export default {
  data () {
    return {
      isValid: false
    }
  },
  methods: {
    loadSdkScript () {
      return new Promise<void>(resolve => {
        const script = document.createElement('script')
        script.async = true
        script.src = '//cdn.checkout.com/js/framesv2.min.js'
        script.onload = () => { resolve() }
        document.body.appendChild(script)
      })
    },
    initFrames () {
      if (!this.info.publicKey) {
        Logger.error('Can\'t init CC because of missing public-key', 'icmaa-checkout-com', this.info)()
        return
      }

      Frames.removeAllEventHandlers()

      Frames.init({
        publicKey: this.info.publicKey,
        localization: {
          cardNumberPlaceholder: this.$t('Card number'),
          expiryMonthPlaceholder: this.$t('MM'),
          expiryYearPlaceholder: this.$t('YY'),
          cvvPlaceholder: this.$t('CVV')
        }
      })

      Frames.addEventHandler(
        Frames.Events.CARD_VALIDATION_CHANGED,
        (event: any) => {
          this.isValid = !!event.isValid
        }
      )

      Frames.addEventHandler(
        Frames.Events.CARD_TOKENIZED,
        (event: any) => {
          this.setToken(event.token)
        }
      )
    },
    setToken (token = null) {
      this.$store.dispatch(`${this.code}/setToken`, token)
    }
  },
  async mounted () {
    this.setToken()
    this.$store.dispatch(`${this.code}/setValidations`, this.$v)

    await this.loadSdkScript()
    this.initFrames()
  },
  beforeDestroy () {
    Frames.removeAllEventHandlers()
  },
  validations () {
    return {
      isValid: {
        required,
        notFalse
      }
    }
  }
}

import { icmaa_checkoutcom } from 'config'
import * as types from 'icmaa-checkout-com/store/methods/card/mutation-types'
import { CODE } from 'icmaa-checkout-com/store/methods/card'

declare const Frames: any;

export default {
  data () {
    return {
      paymentMethod: 'card',
      isDirty: false,
      isValid: false
    }
  },
  computed: {
    paymentMethodIcon () {
      return require(`icmaa-checkout-com/assets/card-icons/${this.paymentMethod}.svg`)
    }
  },
  methods: {
    submit () {
      this.hasSubmitted = true
      Frames.submitCard()
    },
    initFrames () {
      Frames.removeAllEventHandlers()
      Frames.init({
        publicKey: icmaa_checkoutcom.publicKey,
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
          this.isValid = event.isValid

          if (event.isValid) {
            Frames.submitCard()
          }
        }
      );

      Frames.addEventHandler(
        Frames.Events.FRAME_BLUR,
        () => {
          this.isDirty = true
        }
      );

      Frames.addEventHandler(
        Frames.Events.PAYMENT_METHOD_CHANGED,
        (event: any) => {
          this.paymentMethod = event.paymentMethod ? event.paymentMethod.toLowerCase() : 'card'
        }
      );

      Frames.addEventHandler(
        Frames.Events.CARD_TOKENIZED,
        (event: any) => {
          this.$store.commit(CODE + '/' + types.SET_TOKEN, event.token)
        }
      );
    }
  },
  mounted () {
    this.initFrames()
  },
  beforeDestroy () {
    Frames.removeAllEventHandlers()
  }
}

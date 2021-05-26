import { icmaa_checkoutcom } from 'config'
import * as types from 'icmaa-checkout-com/store/mutation-types'
import { CODE } from 'icmaa-checkout-com'

declare const Frames: any;

export default {
  methods: {
    initFrames () {
      Frames.init(icmaa_checkoutcom.publicKey)

      Frames.addEventHandler(
        Frames.Events.CARD_VALIDATION_CHANGED,
        (event: any) => {
          const isCardValid = Frames.isCardValid();
          console.log('CARD_VALIDATION_CHANGED: %o', event);
          this.$store.commit(CODE + '/' + types.SET_IS_VALID, Frames.isCardValid())

          if (isCardValid) {
            Frames.submitCard()
          }
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

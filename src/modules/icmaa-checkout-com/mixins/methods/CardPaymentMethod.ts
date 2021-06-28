import { Logger } from '@vue-storefront/core/lib/logger'
import * as types from 'icmaa-checkout-com/store/methods/card/mutation-types'
import { CODE } from 'icmaa-checkout-com/store/methods/card'

declare const Frames: any

export default {
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
      Frames.init(this.info.publicKey)

      Frames.addEventHandler(
        Frames.Events.CARD_VALIDATION_CHANGED,
        (event: any) => {
          const isCardValid = Frames.isCardValid();
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
  async mounted () {
    await this.loadSdkScript()
    this.initFrames()
  },
  beforeDestroy () {
    Frames.removeAllEventHandlers()
  }
}

import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  computed: {
    languageSwitcherConfigs () {
      return config.icmaa.languageSwitcher.map(l => ({
        url: l[0],
        storeCode: l[1],
        languageCode: l[2],
        name: l[3]
      }))
    },
    languageSwitcherConfig () {
      const { storeCode } = currentStoreView()
      const flagCode = storeCode === 'en' ? 'eu' : storeCode
      return this.languageSwitcherConfigs.find(c => c.languageCode === flagCode)
    },
    languageCode () {
      return this.languageSwitcherConfig.languageCode
    }
  }
}

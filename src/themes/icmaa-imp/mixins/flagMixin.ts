import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  computed: {
    languageSwitcherConfigs () {
      return config.icmaa.languageSwitcher.map(l => {
        const [ url, storeCode, languageCode, name ] = l
        return { url, storeCode, languageCode, name }
      })
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

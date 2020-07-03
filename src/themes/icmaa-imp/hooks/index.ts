import { createListenerHook } from '@vue-storefront/core/lib/hooks'

const {
  hook: selectedLanguageHook,
  executor: selectedLanguageExecutor
} = createListenerHook<{ storeCode: string }>()

const icmaaThemeHooksExecutors = {
  selectedLanguage: selectedLanguageExecutor
}

const icmaaThemeHooks = {
  selectedLanguage: selectedLanguageHook
}

export {
  icmaaThemeHooks,
  icmaaThemeHooksExecutors
}

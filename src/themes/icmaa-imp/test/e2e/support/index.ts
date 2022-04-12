// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', () => false)

before(() => {
  return window.caches && window.caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        return window.caches.delete(cacheName);
      })
    );
  })
})

beforeEach(() => {
  indexedDB.deleteDatabase('shop')
  indexedDB.deleteDatabase('carts')
  cy.clearLocalStorage()
  cy.clearCookies()

  cy.on('window:before:load', window => {
    /**
     * This seems the only way it is working /w Electron – If we load it using `cy.hideCookieConsent()`
     * it works in the browser but not in headless-mode or Electron. After excessive try-n-error this
     * seems the only working solution and is slightly conform to the Usercentrics docs.
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api
     */
    window.UC_UI_SUPPRESS_CMP_DISPLAY = true
    cy.log('Surpress cookie-consent dialog')
  })

  cy.wrap(false).as('storeCode')
})

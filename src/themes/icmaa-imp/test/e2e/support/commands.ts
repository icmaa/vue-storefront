// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Settings from './utils/settings'

const { _ } = Cypress

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const storeCodes: string[] = Settings.availableStoreViews

  let storeCode: string = storeCodes[Math.floor(Math.random() * (storeCodes.length - 1))]
  if (options && options.hasOwnProperty('storeCode')) {
    storeCode = options.storeCode
  }

  Settings.currentStoreView = storeCode

  url = `/${storeCode}${url}`

  return originalFn(url, _.omit(options, ['storeCode']))
})

Cypress.Commands.add('visitAsRecurringUser', (url, options) => {
  localStorage.setItem(
    'shop/uniClaims/cookiesAccepted',
    `{"code":"cookiesAccepted","created_at":"${new Date().toISOString()}","value":true}`
  )

  cy.visit(url, options)
})

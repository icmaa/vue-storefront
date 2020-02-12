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

import Settings from './utils/Settings'
import { Faker } from './utils/Faker'

const { _ } = Cypress

Cypress.Commands.add(
  'random',
  { prevSubject: 'element' },
  subject => cy.wrap(subject).eq(Math.floor(Math.random() * subject.length))
)

Cypress.Commands.add(
  'clickRandomElement',
  { prevSubject: 'element' },
  (subject) => {
    cy.wrap(subject).random().click()
  }
)

Cypress.Commands.add(
  'selectRandomOption',
  { prevSubject: 'element' },
  (subject, skipFirst = false) => {
    const selector = skipFirst ? 'option:not(:first-child)' : 'option'
    cy.wrap(subject).within(() => {
      cy.root().children(selector).random()
        .then(e => {
          cy.root().select(e.val())
        })
    })
  }
)

Cypress.Commands.add('randomlyClickElement', { prevSubject: 'element' }, (subject) => {
  const click = (Faker().random.number(1) > 0)
  if (click) {
    cy.wrap(subject).click()
  } else {
    cy.log('I decided not to click the prev element')
  }
})

Cypress.Commands.add('checkImage', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject)
    .should('be.visible')
    .and($img => expect($img[0].naturalWidth).to.be.greaterThan(0))
})

Cypress.Commands.add('getByTestId', { prevSubject: 'optional' }, (subject, id) => {
  cy.get(`[data-test-id="${id}"]`)
})

Cypress.Commands.add('findByTestId', { prevSubject: 'element' }, (subject, id) => {
  cy.wrap(subject)
    .find(`[data-test-id="${id}"]`)
})

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const storeCodes: string[] = Settings.availableStoreViews

  let storeCode: string = storeCodes[Math.floor(Math.random() * (storeCodes.length - 1))]
  if (options && options.hasOwnProperty('storeCode') && storeCodes.includes(options.storeCode)) {
    storeCode = options.storeCode
  }

  Settings.currentStoreView = storeCode

  if (!url.startsWith('/')) {
    url = '/' + url
  }

  url = `${storeCode}${url}`

  return originalFn(url, _.omit(options, ['storeCode']))
})

Cypress.Commands.add('visitAsRecurringUser', (url, options) => {
  localStorage.setItem(
    'shop/uniClaims/cookiesAccepted',
    `{"code":"cookiesAccepted","created_at":"${new Date().toISOString()}","value":true}`
  )

  localStorage.setItem(
    'shop/uniClaims/languageAccepted',
    `{"code":"languageAccepted","created_at":"${new Date().toISOString()}","value":"de-DE"}`
  )

  cy.visit(url, options)
})

Cypress.Commands.add('openNavigationSidebar', (trigger: string = '[data-test-id="HeaderButtonSidebar"]', overlaySelector: string = '[data-test-id="Sidebar"]') => {
  cy.get(trigger)
    .should('be.visible')
    .click()

  cy.get(overlaySelector)
    .as('sidebar')
    .should('be.visible')
})

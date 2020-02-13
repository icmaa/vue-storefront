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
import Faker, { getIcmaaEmail, getBirthday } from './utils/Faker'

const { _ } = Cypress

Cypress.Commands.add('getFaker', () => {
  cy.getStoreCode().then(storeCode => {
    cy.wrap(Faker(storeCode)).as('faker')
  })
})

Cypress.Commands.add('createCustomerWithFaker', () => {
  cy.getFaker().then(faker => {
    cy.wrap({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: getIcmaaEmail(),
      password: faker.internet.password(10, true),
      dob: getBirthday()
    }).as('customer')
  })
})

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

  if (!url.startsWith('/')) {
    url = '/' + url
  }

  url = `${storeCode}${url}`

  // Register current storeCode as global alias
  return cy.wrap(storeCode).as('storeCode').then(() =>
    originalFn(url, _.omit(options, ['storeCode']))
  )
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

Cypress.Commands.add('getStoreCode', () => {
  cy.get<string>('@storeCode')
})

Cypress.Commands.add('openNavigationSidebar', (trigger: string = '[data-test-id="HeaderButtonSidebar"]', overlaySelector: string = '[data-test-id="Sidebar"]') => {
  cy.get(trigger)
    .should('be.visible')
    .click()

  cy.get(overlaySelector)
    .as('sidebar')
    .should('be.visible')
})

Cypress.Commands.add('openFilterSidebar', () => {
  cy.openNavigationSidebar('[data-test-id="ButtonFilter"]')
})

Cypress.Commands.add('registerCustomer', () => {
  cy.visitAsRecurringUser('/')
  cy.createCustomerWithFaker()

  cy.openNavigationSidebar('[data-test-id="HeaderButtonAccount"]', '[data-test-id="Modal"]')
    .get('@sidebar')
    .findByTestId('registerLink')
    .click()

  cy.getByTestId('Register')
    .find('form').as('form')
    .should('be.visible')

  cy.getCustomer().then(customer => {
    cy.get('@form').find('input[name="email"]').type(customer.email)
    cy.get('@form').find('input[name="first-name"]').type(customer.firstName)
    cy.get('@form').find('input[name="last-name"]').type(customer.lastName)
    cy.get('@form').find('select[name="gender"]').selectRandomOption(true)
    cy.get('@form').find('input[name="dob"]').type(customer.dob)
    cy.get('@form').find('input[name="password"]').type(customer.password)
    cy.get('@form').find('input[name="password-confirm"]').type(customer.password)
    cy.get('@form').findByTestId('newsletterCheckbox').randomlyClickElement()
    cy.get('@form').findByTestId('registerSubmit').click()
  })

  cy.getByTestId('Loader').should('be.visible')
  cy.getByTestId('NotificationItem').should('be.visible')
})

Cypress.Commands.add('getCustomer', () => {
  cy.get<Cypress.Customer>('@customer')
})

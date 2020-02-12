import { Faker, getRandomIcmaaEmail, getRandomBirthday } from '../../support/utils/Faker'

describe('Customer', () => {
  const faker = Faker()
  const email = getRandomIcmaaEmail()
  const password = faker.internet.password(10, true)
  const dob = getRandomBirthday()

  it('creates an account', () => {
    cy.visitAsRecurringUser('/')
    cy.openNavigationSidebar('[data-test-id="HeaderButtonAccount"]', '[data-test-id="Modal"]')
      .get('@sidebar')
      .findByTestId('registerLink')
      .click()

    cy.getByTestId('Register')
      .find('form').as('form')
      .should('be.visible')

    cy.get('@form').find('input[name="email"]').type(email)
    cy.get('@form').find('input[name="first-name"]').type(faker.name.firstName())
    cy.get('@form').find('input[name="last-name"]').type(faker.name.lastName())
    cy.get('@form').find('select[name="gender"]').selectRandomOption(true)
    cy.get('@form').find('input[name="dob"]').type(dob)
    cy.get('@form').find('input[name="password"]').type(password)
    cy.get('@form').find('input[name="password-confirm"]').type(password)
    cy.get('@form').findByTestId('newsletterCheckbox').randomlyClickElement()
    cy.get('@form').findByTestId('registerSubmit').click()
  })
})

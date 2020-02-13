import Faker, { getIcmaaEmail } from '../../support/utils/Faker'

const faker = Faker()
const email = getIcmaaEmail()

describe('Contact', () => {
  it('Check Form', () => {
    cy.visitAsRecurringUser('/service-contact')
    cy.get('div[data-test-id="ServiceContactSelector"]').random().click().then(($selector) => {
      if ($selector.find('div[data-test-id="ServiceContactChildrenSelector"]').length > 0) {
        cy.get('div[data-test-id="ServiceContactChildrenSelector"]').random().click()
      }
    })
    cy.get('input#name').click().type(faker.name.findName())
    cy.get('input#phone').click().type(faker.phone.phoneNumber())
    cy.get('input#email').click().type(email)
    cy.get('input#order_number').click().type('123456789')
    cy.get('textarea#message').click().type(faker.random.words())
    cy.get('#cms-page').find('button').click()
    cy.get('[data-test-id="NotificationItem"].t-bg-alt-3')
  })
})

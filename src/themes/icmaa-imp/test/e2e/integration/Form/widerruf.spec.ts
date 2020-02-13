import { getIcmaaEmail } from '../../support/utils/Faker'

describe('widerruf-formular', () => {
  it('Check Form', () => {
    cy.visitAsRecurringUser('/widerruf-formular')

    cy.getFaker().then(faker => {
      cy.get('input#order_number').click().type('12345678')
      cy.get('input#order_date').click().type('02.02.2020')
      cy.get('input#widerruf_date').click().type('02.02.2020')
      cy.get('input#name').click().type(faker.name.findName())
      cy.get('input#email').click().type(getIcmaaEmail())
      cy.get('textarea#address').click().type(faker.address.city())
    })

    cy.get('#cms-page').find('button').click()
    cy.get('[data-test-id="NotificationItem"].t-bg-alt-3')
  })
})

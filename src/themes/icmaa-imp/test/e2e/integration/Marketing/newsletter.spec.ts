import { getRandomIcmaaEmail } from '../../support/utils/Faker'

describe('Newsletter', () => {
  it('Subscribe', () => {
    cy.visitAsRecurringUser('/')
    cy.get('.newsletter > div > input').click()
    cy.get('.modal-container').find('input').type(getRandomIcmaaEmail())
    cy.get('.modal-container').find('button[type="submit"]').click()
    cy.get('[data-test-id="NotificationItem"].t-bg-alt-3')
  })
})

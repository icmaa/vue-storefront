describe('Newsletter', () => {
  it('Subscribe', () => {
    cy.visitAsRecurringUser('/')
    cy.get('.newsletter > div > input').click()
    cy.get('.modal-container').find('input').type('a9.tests+cypress@impericon.com')
    cy.get('.modal-container').find('button[type="submit"]').click()
    cy.get('[data-test-id="notificationMessage"]').contains('OK')
  })
})

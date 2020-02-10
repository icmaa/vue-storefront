describe('Homepage', () => {
  it('Teaser should be visible in two blocks on homepage', () => {
    cy.visit('/')
    cy.get('[data-test-id="Teaser"]').should('have.length', 4)
  })

  it('Visit next page without cookie notice', () => {
    cy.visitAsRecurringUser('/merchandise')
  })
})

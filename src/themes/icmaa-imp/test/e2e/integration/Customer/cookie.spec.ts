describe('Cookie-Notice', () => {
  it('Visit and close the Language-Switcher', () => {
    cy.visit('/')
    cy.get('[data-test-id="ModalClose"]').click();
  })

  it('Visit next page without cookie notice', () => {
    cy.visitAsRecurringUser('/merchandise')
  })
})

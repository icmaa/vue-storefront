describe('Resetpassword page', () => {
  it('Show forgot-password modal', () => {
    cy.visitAsRecurringUser('/customer/account/resetpassword')
    cy.get('[data-test-id=Modal]').should('be.visible')
    cy.get('@storeCode').then((storeCode) => {
      cy.location('pathname').should('eq', `/${storeCode}`)
    })
  })
  it('Dont show forgot-password modal', () => {
    cy.visitAsRecurringUser('/customer/account/resetpassword?token=testtoken&email=testemail')
    cy.get('[data-test-id=Modal]').should('not.exist')
    cy.location('pathname').should('include', '/customer/account/resetpassword')
  })
})

describe('CMS', () => {
  it('Check Festival CMS Page', () => {
    cy.visitAsRecurringUser('/festival')
  })
  it('Check INSD CMS Page', () => {
    cy.visitAsRecurringUser('/impericon-never-say-die')
  })
  it('Check Affilinet CMS Page', () => {
    cy.visitAsRecurringUser('/partnerprogramm')
  })
})

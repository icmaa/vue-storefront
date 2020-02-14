describe('CMS', () => {
  it('Check CMS Pages', () => {
    cy.visitAsRecurringUser('/festival')
    cy.visit('/impericon-never-say-die')
    cy.visit('/partnerprogramm')
  })
})

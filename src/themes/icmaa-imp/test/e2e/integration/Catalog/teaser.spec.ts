describe('Teaser', () => {
  it('should be visible on category page', () => {
    cy.visitAsRecurringUser('/sales.html')
    cy.getByTestId('Teaser').should('be.visible')
  })
  it('should be toggled on category page when GET parameter filter is set', () => {
    cy.visitAsRecurringUser('/sales.html?gender=9')
    cy.getByTestId('Teaser').should('be.not.visible')
    cy.visit('/sales.html?utm_source=CUSTOMSOURCE')
    cy.getByTestId('Teaser').should('be.visible')
  })
})

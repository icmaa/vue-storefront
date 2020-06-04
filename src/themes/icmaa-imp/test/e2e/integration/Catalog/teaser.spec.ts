describe('Teaser', () => {
  it('should be visible on category page', () => {
    cy.visit('/sales.html')
    cy.getByTestId('Teaser').should('be.visible')
  })
  it('should be toggled on category page when GET parameter filter is set', () => {
    cy.visit('/sales.html?gender=9')
    cy.getByTestId('Teaser').should('be.not.visible')
    cy.visit('/sales.html?utm_source=CUSTOMSOURCE')
    cy.getByTestId('Teaser').should('be.visible')
  })
})

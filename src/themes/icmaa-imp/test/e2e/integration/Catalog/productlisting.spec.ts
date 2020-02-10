describe('Productlisting', () => {
  it('Teaser, Logoline and Productlistings should be visible on Sales', () => {
    cy.visit('/sales.html')
    // Teaser  cy.get('[data-test-id="Teaser"]').should('be.visible')
    // Logoline  cy.get('[data-test-id="LogoLine"]').should('be.visible')
    cy.get('[data-test-id="ProductListing"]').should('be.visible')
  })
})

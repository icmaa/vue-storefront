describe('Teaser', () => {
  it('Show teaser', () => {
    cy.visit('/sales.html')
    cy.getByTestId('Teaser').should('be.visible')
  })
  it('Hide teaser', () => {
    cy.visit('/sales.html?gender=9')
    cy.getByTestId('Teaser').should('be.not.visible')
  })
})

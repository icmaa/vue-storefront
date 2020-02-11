describe('Add to Cart', () => {
  it('Is it possible to add a product to the cart.', () => {
    cy.visitAsRecurringUser('/sales.html')
    cy.get('div[data-test-id="ProductTile"]:first-child a').click({force: true})
    cy.get('button[data-test-id="AddToCart"]').should('not.be.disabled').click({force: true})
    cy.get('.sidebar-content > div > div > div:first-child').click()
    cy.get('[data-test-id="notificationMessage"]').should('be.visible')
  })
})

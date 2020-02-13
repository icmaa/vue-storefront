describe('Add to Cart', () => {
  it('Is it possible to add a product to the cart.', () => {
    cy.visitAsRecurringUser('/new')
    cy.get('div[data-test-id="ProductTile"]').find('[data-test-id="productLink"]').random().click()
    cy.get('button[data-test-id="AddToCart"]').should('not.be.disabled').click()
    cy.get('.sidebar-content > div > div > div ').random().click().wait(1000) // TODO "Größe anfordern" abfangen data-test-id="StockAlertSubscrbe"
    cy.get('[data-test-id="NotificationItem"].t-bg-alt-3')
  })
})

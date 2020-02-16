describe('Add to Cart', () => {
  it('Is it possible to add a product to the cart.', () => {
    cy.visitCategoryPage()
    cy.getByTestId('ProductTile').random().findByTestId('productLink').click()
    cy.getByTestId('AddToCart').click()
    cy.openNavigationSidebar('[data-test-id="HeaderButtonCart"]')
    cy.getByTestId('Sidebar').find('.sidebar-content > div > div > div ').random().click()
    cy.checkNotification('success')
  })
})

// click Button, wenn nicht disable
// - wenn sidebar ... configprodukt und click größe
//     - klicke number, wo kein StockAlertSubscrbe ist
// check grün

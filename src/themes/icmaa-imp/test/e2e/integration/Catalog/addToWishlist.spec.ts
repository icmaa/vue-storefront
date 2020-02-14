describe('Add to And Remove from Wishlist ...', () => {
  it('... from ProductDetailPage', () => {
    cy.visitCategoryPage()
    cy.getByTestId('ProductTile').random().findByTestId('productLink').click()
    cy.getByTestId('AddToWishlistButton').click()
    cy.checkNotification('success')
    cy.openNavigationSidebar('[data-test-id="HeaderButtonWishlist"]')
    cy.get('@sidebar').getByTestId('AddToWishlistButton').clickRandomElement()
    cy.checkNotification('success')
  })

  it('... from ProductListing', () => {
    cy.visitCategoryPage()
    cy.getByTestId('ProductListing').findByTestId('AddToWishlist').clickRandomElement()
    cy.checkNotification('success')
    cy.openNavigationSidebar('[data-test-id="HeaderButtonWishlist"]')
    cy.get('@sidebar').getByTestId('AddToWishlistButton').clickRandomElement()
    cy.checkNotification('success')
  })
})

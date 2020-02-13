describe('Add to And Remove from Wishlist ...', () => {
  it('... from ProductDetailPage', () => {
    cy.visitCategoryPage()
    cy.getByTestId('ProductTile').findByTestId('productLink').clickRandomElement()
    cy.getByTestId('AddToWishlistButton').click()
    cy.checkNotification('success')
    cy.getByTestId('HeaderButtonWishlist').click({force: true})
    cy.getByTestId('AddToWishlistButton').clickRandomElement()
    cy.checkNotification('success')
  })

  it('... from ProductListing', () => {
    cy.visitCategoryPage()
    cy.getByTestId('ProductListing').findByTestId('AddToWishlist').clickRandomElement()
    cy.checkNotification('success')
    cy.getByTestId('HeaderButtonWishlist').click({force: true})
    cy.getByTestId('AddToWishlistButton').clickRandomElement()
    cy.checkNotification('success')
  })
})

describe('Add to and remove from wishlist ', () => {
  it('on PDP', () => {
    cy.visitProductDetailPage()
    cy.getByTestId('CurrentProductWishlistButton').click()
    cy.checkNotification('success')
    cy.scrollTo('top')
    cy.openSidebar('[data-test-id="HeaderButtonWishlist"]')
    cy.get('@sidebar').findByTestId('wishlistButton').clickRandomElement()
    cy.checkNotification('success')
  })

  it('on CLP', () => {
    cy.visitCategoryPage()
    cy.wait(1000)
    cy.getByTestId('ProductTile')
      .random()
      .findByTestId('wishlistButton')
      .scrollIntoView()
      .click()
    cy.checkNotification('success')
  })
})

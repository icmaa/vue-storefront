describe('Add to Cart', () => {
  it('Is it possible to add a product to the cart.', () => {
    // cy.visitAsRecurringUser('/media.html')
    cy.visitCategoryPage()

    cy.getByTestId('ProductTile').random().findByTestId('productLink').click()

    // AddToCart Button enabled
    cy.get('#product').then(($product) => {
      if ($product.find('[disabled="disabled"]').length > 0) {
        cy.log('AddToCart Button disabled - reload last step')
        cy.go(-4)
      } else {
        cy.log('AddToCart Button enabled')
        cy.get('[data-test-id="AddToCart"]').click()
      }
    })

    // config or simple Product
    cy.get('#product').then(($a2c) => {
      if ($a2c.find('.sidebar-content').length > 0) {
        cy.log('Configurable Product - select Option')
        // if child is availible
        cy.get('.sidebar-content').find('span').should('not.have.class', 't-text-base-light').random().click()
        cy.checkNotification('success')
      } else {
        cy.log('Simple Product')
        cy.get('[data-test-id="AddToCart"]').click()
        cy.checkNotification('success')
      }
    })
  })
})

// disabled / enable  button works
// simpleProduct works
//

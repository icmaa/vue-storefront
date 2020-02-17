describe('Add to Cart', () => {
  it('Is it possible to add a product to the cart.', () => {
    // cy.visitAsRecurringUser('/media.html')
    cy.visitCategoryPage()

    cy.getByTestId('ProductTile').random().findByTestId('productLink').click()

    // AddToCart Button enabled
    cy.get('#product').then(($product) => {
      if ($product.find('[disabled="disabled"]').length > 0) {
        cy.log('AddToCart Button disabled - reload last step')
        cy.go(-1)
        cy.getByTestId('ProductTile').random().findByTestId('productLink').click()
      } else {
        cy.log('AddtoCart Button enabled')
        cy.get('[data-test-id="AddToCart"]').click()
      }
    })

    // config or simple Product
    cy.get('#product').then(($a2c) => {
      if ($a2c.find('.sidebar-content').length > 0) {
        cy.log('Configurable Product - select Option')
        // if child is availible
        cy.get('.sidebar-content').find('div > div > div').should('not.contain', 'span ["data-test-id="StockAlertSubscrbe"]').random().click()
      } else {
        cy.get('[data-test-id="AddToCart"]').click()
      }
    })
    cy.checkNotification('success')
  })
})

// click Button, wenn nicht disable (disabled="disabled") should('not.be.disabled')
// click sidebar if "AddToCartSize"
// - wenn sidebar ... configprodukt und click größe
//     - klicke number, wo kein StockAlertSubscrbe ist should('not.contain', '["data-test-id="StockAlertSubscrbe"]')
// check grün

describe('Add to Cart', () => {
  // it('is possible to add a product to the cart.', () => {
  //   cy.addRandomProductToCart()
  // })

  it('is it possible to add a product to the cart from PLP.', () => {
    cy.visitCategoryPage({ url: '/girls.html?type_top=99' })

    // PAGE IS RELOADED HERE

    cy.getByTestId('ProductTile')
      .random()
      .as('Product')

    cy.get('@Product')
      .findByTestId('ProductName')
      .then($productName => {
        cy.wrap($productName.text().trim()).as('ProductName')
      })

    cy.get('@Product')
      .findByTestId('QuickAddToCart')
      .click()

    cy.getByTestId('Sidebar')
      .as('Sidebar')
      .should('be.visible')

    cy.get('@Sidebar')
      .findByTestId('DefaultSelector')
      .clickRandomElement()

    cy.getByTestId('AddToCart')
      .should('not.be.disabled')
      .click()

    cy.get('@Sidebar')
      .should('not.be.visible')

    cy.checkNotification('success')

    cy.getByTestId('MicroCart')
      .should('be.visible')
      .findByTestId('MicroCartProduct')
      .findByTestId('productLink')
      .then($product => {
        cy.get<string>('@ProductName').then(name => {
          expect($product.text().trim())
            .contain(name, 'Product is found in cart by title')
        })
      })
  })
})

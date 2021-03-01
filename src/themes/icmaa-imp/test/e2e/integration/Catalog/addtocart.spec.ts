describe('Add to Cart', () => {
  it('is working for random product on PDP.', () => {
    cy.addRandomProductToCart()
  })

  it('is working for random product on PLP.', () => {
    cy.visitCategoryPage({ url: '/clothing.html?type_top=99' })

    /**
     * @todo The page gets rerendered after initial load.
     * Thats why we need to wait a bit until this happens.
     * I'll search the cause and remove this workaround.
     */
    cy.wait(1000)

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
      .filter('.available')
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

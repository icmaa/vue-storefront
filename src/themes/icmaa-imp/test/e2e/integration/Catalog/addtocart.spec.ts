describe('Add to Cart', () => {
  // it('is working for random product on PDP.', () => {
  //   cy.addRandomProductToCart()
  // })

  it('is working for random product on PLP.', () => {
    const findProductInStock = (run: number = 1, tries: number = 3) => {
      if (run > tries) {
        expect(true).to.be.equal(false, 'No buyable products found')
      } else {
        cy.log(`Try to find product which is in stock ${run}/${tries}`)
      }

      cy.visitCategoryPage({ url: '/t-shirts-tanks-and-girlies.html' })

      /**
     * @todo The page gets rerendered after initial load.
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
        .scrollIntoView()
        .click()

      cy.getByTestId('Sidebar')
        .as('sidebar')
        .should('be.visible')

      cy.registerStockApiRequest()
      cy.checkAvailabilityOfCurrentProductInSidebar()

      cy.get<boolean>('@availability')
        .then(available => {
          if (!available) {
            findProductInStock(run + 1)
          }
        })
    }

    findProductInStock()

    cy.getByTestId('AddToCart')
      .should('not.be.disabled')
      .click()

    cy.get('@sidebar')
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

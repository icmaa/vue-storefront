describe('Add to Cart', () => {
  it('Is it possible to add a product to the cart.', () => {
    cy.visitAsRecurringUser('/new')

    cy.get('div[data-test-id="ProductTile"]').find('[data-test-id="productLink"]').random().click()

    cy.get('#product').then(($btn) => {
      if ($btn.find('button[data-test-id="AddToCart"]').attr('disabled')) {
        // noch mal
      } else {
        cy.get('button[data-test-id="AddToCart"]').click().then(($abtn) => {
          if ($abtn.find('.sidebar-content').should('be.visible')) {
            cy.get('.sidebar-content > div > div > div ').then(($outofstock) => {
              if ($outofstock.find('[data-item-id="StockAlertSubscrbe"]')) {
                // to14
              } else {
                cy.get('.sidebar-content > div > div > div ').random().click()
              }
            })
          } else {
            cy.get('button[data-test-id="AddToCart"]').click()
          }
        })
        cy.get('[data-test-id="NotificationItem"].t-bg-alt-3')
      }
    })
  })
})

// click Button, wenn nicht disable
// - wenn sidebar ... configprodukt und click größe
//     - klicke number, wo kein StockAlertSubscrbe ist
// check grün

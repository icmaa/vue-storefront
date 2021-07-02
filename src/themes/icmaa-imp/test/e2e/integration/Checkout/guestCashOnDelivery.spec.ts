describe('Checkout', () => {
  it('as guest and use cash-on-delivery.', () => {
    cy.visitAsRecurringUser('/', { storeCode: 'de' })

    cy.addRandomProductToCart({ enterCheckout: true })

    cy.createCustomerWithFaker()

    cy.checkoutFillPersonalDetails()

    cy.checkoutFillNewAdress()

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Cashondelivery')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn(false)
  })
})

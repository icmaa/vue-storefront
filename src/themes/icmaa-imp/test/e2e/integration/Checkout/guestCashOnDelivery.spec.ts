describe('Checkout', () => {
  it('as guest and use cash-on-delivery.', () => {
    cy.createCartAndGoToCheckout('de')

    cy.checkoutFillPersonalDetails()

    cy.checkoutFillAddress()

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Cashondelivery')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn(false)
  })
})

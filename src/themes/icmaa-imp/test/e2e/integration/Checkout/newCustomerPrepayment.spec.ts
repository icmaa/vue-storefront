describe('Checkout', () => {
  it('as new user, create an account and use prepayment.', () => {
    cy.createCartAndGoToCheckout('de')

    cy.checkoutFillPersonalDetails(true)

    cy.checkoutFillAddress()

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Bankpayment')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

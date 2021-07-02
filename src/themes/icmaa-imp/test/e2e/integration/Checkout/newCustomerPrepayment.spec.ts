describe('Checkout', () => {
  it('as new user, create an account and use prepayment.', () => {
    cy.createCartAndGoToCheckout()

    cy.checkoutFillPersonalDetails(true)

    cy.checkoutFillNewAdress()

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Bankpayment')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

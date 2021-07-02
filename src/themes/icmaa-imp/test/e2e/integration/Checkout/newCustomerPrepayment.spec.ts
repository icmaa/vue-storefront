describe('Checkout', () => {
  it('as new user, create an account and use prepayment.', () => {
    cy.visitAsRecurringUser('/')

    cy.addRandomProductToCart({ enterCheckout: true })

    cy.createCustomerWithFaker()

    cy.checkoutFillPersonalDetails(true)

    cy.checkoutFillNewAdress()

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Bankpayment')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

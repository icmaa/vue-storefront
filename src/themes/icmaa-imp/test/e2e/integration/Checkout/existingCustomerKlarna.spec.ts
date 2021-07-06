describe('Checkout', () => {
  it('as existing customer and use Klarna as payment-method.', () => {
    cy.registerCustomerWithAddress('de')
    cy.createCartAndGoToCheckout()

    cy.checkoutFillPersonalDetails()

    cy.checkoutFillAddress()

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('CheckoutcomApmKlarna')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

describe('Checkout', () => {
  it('as existing customer and use Klarna as payment-method.', () => {
    cy.registerCustomerWithAddress('de')
    cy.createCartAndGoToCheckout()

    cy.checkoutFillAddress(true)

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('CheckoutcomApmKlarna', false)
    cy.get('#klarna_container').getFrame().wait(5000) // Wait for iframe to be ready
    cy.get('@payment').checkoutGoToNextStep()

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

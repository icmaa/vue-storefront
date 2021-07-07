describe('Checkout', () => {
  it('as existing customer and use Klarna as payment-method.', () => {
    cy.registerCustomerWithAddress('de')
    cy.createCartAndGoToCheckout('de')

    cy.checkoutFillAddress(true)

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('CheckoutcomApmKlarna', false)
    // Wait for iframe to be ready
    cy.get('#klarna_container').getFrame().wait(3000)
    cy.get('@payment').checkoutGoToNextStep()

    // Some faker addresses wont work, like:
    // Wimmer - Schellenbeck
    // Rebecca Koszewski
    // 8701 Nils Stravenue
    // 40817 West Yusuf
    // Deutschland

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

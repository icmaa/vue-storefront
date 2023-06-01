describe('Checkout', () => {
  it('as existing customer and use prepayment as payment-method.', () => {
    cy.registerCustomerWithAddress('de')
    cy.createCartAndGoToCheckout()
    cy.checkoutFillAddress(true)
    cy.checkoutFillShipping()
    cy.checkoutFillPayment('Bankpayment')
    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

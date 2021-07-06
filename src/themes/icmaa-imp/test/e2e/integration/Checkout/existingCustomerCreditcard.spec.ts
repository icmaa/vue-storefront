describe('Checkout', () => {
  it('as an existing customer and use credit-card payment.', () => {
    cy.registerCustomerWithAddress()
    cy.createCartAndGoToCheckout()

    cy.checkoutFillAddress(true)

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Bankpayment')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

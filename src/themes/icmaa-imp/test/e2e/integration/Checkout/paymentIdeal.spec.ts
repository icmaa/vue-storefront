describe('Checkout', () => {
  it('as guest customer and use iDeal payment.', () => {
    cy.createCartAndGoToCheckout('nl')
    cy.checkoutFillPersonalDetails()
    cy.checkoutFillAddress()
    cy.checkoutFillShipping()

    cy.checkoutFillPayment('CheckoutcomApmIdeal', false)

    cy.get('@payment').findByTestId('CheckoutcomApmIdealForm').as('form')
    cy.get('@form').focusInput('bic').type('RABONL2U')

    cy.get('@payment').checkoutGoToNextStep()

    cy.checkoutPlaceOrder(true)
    cy.url().should('contain', 'idealtest.secure-ing.com')
    cy.get('input[name="button.edit"]').click()

    cy.url().should('include', `checkout-gateway-success`)
    cy.url().should('include', `checkout-success`)

    cy.isLoggedIn(false)
  })
})

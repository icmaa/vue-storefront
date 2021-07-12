describe('Checkout', () => {
  it('as guest customer and use SEPA payment.', () => {
    cy.createCartAndGoToCheckout('de')
    cy.checkoutFillPersonalDetails()
    cy.checkoutFillAddress()
    cy.checkoutFillShipping()

    cy.checkoutFillPayment('CheckoutcomApmSepa', false)

    cy.get('@payment').findByTestId('CheckoutcomApmSepaForm').as('form')
    cy.get('@form').focusInput('iban').type('DE25100100101234567893')
    cy.get('@form').find('label[for="terms"]').click()

    cy.get('@payment').checkoutGoToNextStep()

    cy.checkoutPlaceOrder()

    cy.isLoggedIn(false)
  })
})

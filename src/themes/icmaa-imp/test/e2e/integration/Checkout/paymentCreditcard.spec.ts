describe('Checkout', () => {
  it('as guest customer and use credit-card payment.', () => {
    cy.createCartAndGoToCheckout()
    cy.checkoutFillPersonalDetails()
    cy.checkoutFillAddress()

    cy.checkoutFillPayment('CheckoutcomCard', false)

    const testNumbers = [
      ['4242424242424242', '100'], // Visa
      ['4543474002249996', '956'],
      ['5436031030606378', '257'], // Mastercard
      ['5199992312641465', '010']
    ]

    const [ ccNumber, ccCVV ] = testNumbers[Math.floor(Math.random() * testNumbers.length)]

    cy.wrap(ccNumber).debug()
    cy.wrap(ccCVV).debug()

    cy.get('@payment')
      .findByTestId('CheckoutcomCardForm')
      .getFrame().as('ccIframe')

    cy.wait(3000) // Wait for checkout.com iFrame to be loaded

    cy.get('@ccIframe').find('input[name="cardnumber"]').type(ccNumber)
    cy.get('@ccIframe').find('input[name="cvc"]').type(ccCVV)
    cy.get('@ccIframe').find('input[name="exp-date"]').type('10/25')

    cy.get('@payment').checkoutGoToNextStep()

    cy.checkoutPlaceOrder(true)

    // ... Checkout.com logic

    cy.isLoggedIn()
  })
})

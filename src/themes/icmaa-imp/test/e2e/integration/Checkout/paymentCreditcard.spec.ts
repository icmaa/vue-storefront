describe('Checkout', () => {
  it('as guest customer and use credit-card payment.', () => {
    cy.createCartAndGoToCheckout()
    cy.checkoutFillPersonalDetails()
    cy.checkoutFillAddress()
    cy.checkoutFillShipping()

    cy.checkoutFillPayment('CheckoutcomCard', false)

    const testNumbers = [
      ['4242424242424242', '100'] // Visa
      // Only the first item is redirecting to the 3DS dialog, the other numbers are just accepted.
      // ['4543474002249996', '956'],
      // ['5436031030606378', '257'], // Mastercard
      // ['5199992312641465', '010']
    ]

    const [ ccNumber, ccCVV ] = testNumbers[Math.floor(Math.random() * testNumbers.length)]

    cy.intercept({ method: 'POST', pathname: '/framesv2/log*' })
      .as('checkoutcomIframeReq')
    cy.wait('@checkoutcomIframeReq')

    cy.get('@payment')
      .findByTestId('CheckoutcomCardForm')
      .wait(3000)
      .getFrame().as('ccIframe')
      .then(() => {
        cy.get('@ccIframe').find('input[name="cardnumber"]').type(ccNumber)
        cy.get('@ccIframe').find('input[name="exp-date"]').type('01/30')
        cy.get('@ccIframe').find('input[name="cvc"]').type(ccCVV)
      })

    cy.get('@payment').checkoutGoToNextStep()

    cy.checkoutPlaceOrder(true)
    cy.location('host', { log: true })
      .should('contain', 'checkout.com')

    // cy.get('body')
    //   .getFrame('[name="cko-3ds2-iframe"]')
    //   .as('3dsIframe')
    //   .then(() => {
    //     cy.get('@3dsIframe').find('input[name="login_email"]').type('Checkout1!')
    //     cy.get('@3dsIframe').find('#form input[type="submit"]').click()
    //   })

    // cy.isLoggedIn(false)
  })
})

describe('Checkout', () => {
  it('as guest and use a poststation address.', () => {
    cy.createCartAndGoToCheckout('de')

    cy.checkoutFillPersonalDetails()

    cy.getCustomer().then(customer => {
      cy.get('#checkout .step-addresses .addresses').as('addresses')
      cy.get('@addresses').get('.address-shipping').as('shipping-address')

      cy.get('@shipping-address').find('label[for="poststation"]').click()

      cy.get('@shipping-address').focusInput('company').type('1234567890')
      cy.get('@shipping-address').focusInput('street[0]').type('Packstation 123')
      cy.get('@shipping-address').focusInput('postcode').type(customer.address.zipCode())
      cy.get('@shipping-address').focusInput('city').type(customer.address.city())

      cy.get('@addresses').findByTestId('NextStepButton').click()
      cy.waitForLoader()
    })

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Bankpayment')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn(false)
  })

  it('as guest and use add a different billing address.', () => {
    cy.createCartAndGoToCheckout('de')

    cy.checkoutFillPersonalDetails()

    cy.get('#checkout .step-addresses .addresses').as('addresses')
    cy.get('@addresses').get('.address-shipping')
      .should('be.visible')
      .checkoutFillNewAddressForm()

    cy.get('@addresses').find('label[for="use-for-billing"]').click()
    cy.get('@addresses').get('.address-billing')
      .should('be.visible')
      .checkoutFillNewAddressForm()

    cy.get('@addresses').findByTestId('NextStepButton').click()
    cy.waitForLoader()

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Bankpayment')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn(false)
  })
})

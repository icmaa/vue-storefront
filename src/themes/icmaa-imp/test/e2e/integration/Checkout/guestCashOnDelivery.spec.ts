describe('Checkout', () => {
  it('as guest and use cash-on-delivery.', () => {
    cy.visitAsRecurringUser('/', { storeCode: 'de' })

    cy.addRandomProductToCart({ enterCheckout: true })

    cy.createCustomerWithFaker()

    cy.checkoutFillPersonalDetails()

    cy.getCustomer().then(customer => {
      cy.get('#checkout .step-addresses .addresses').as('addresses')
      cy.get('@addresses').get('.address-shipping').as('shipping-address')

      cy.get('@shipping-address').focusInput('street[0]').type(customer.address.streetAddress())
      cy.get('@shipping-address').focusInput('postcode').type(customer.address.zipCode())
      cy.get('@shipping-address').focusInput('city').type(customer.address.city())

      cy.get('@addresses').findByTestId('NextStepButton').click()
      cy.waitForLoader(1000)
    })

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Cashondelivery')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn(false)
  })
})

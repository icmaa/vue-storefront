describe('Checkout', () => {
  it('as new user, create an account and use prepayment.', () => {
    cy.visitAsRecurringUser('/')

    cy.addRandomProductToCart({ enterCheckout: true })

    cy.createCustomerWithFaker()

    cy.checkoutFillPersonalDetails(true)

    cy.getCustomer().then(customer => {
      cy.get('#checkout .step-addresses .addresses').as('addresses')
      cy.get('@addresses').get('.address-shipping').as('shipping-address')

      cy.get('@shipping-address').focusInput('street[0]').type(customer.address.streetAddress())
      cy.get('@shipping-address').focusInput('postcode').type(customer.address.zipCode())
      cy.get('@shipping-address').focusInput('city').type(customer.address.city())
      cy.get('@shipping-address').focusInput('telephone').type(customer.phone.phoneNumber())

      cy.get('@addresses').findByTestId('NextStepButton').click()
      cy.waitForLoader(1000)
    })

    cy.checkoutFillShipping()

    cy.checkoutFillPayment('Bankpayment')

    cy.checkoutPlaceOrder()
    cy.isLoggedIn()
  })
})

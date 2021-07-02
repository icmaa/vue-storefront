describe('Checkout', () => {
  it('as new user and create an account.', () => {
    cy.visitAsRecurringUser('/')

    cy.addRandomProductToCart({ enterCheckout: true })

    cy.createCustomerWithFaker()
    cy.getCustomer().then(customer => {
      cy.get('#checkout .step-personal .personal-details').as('form')

      cy.get('@form').find('input[name="email"]').focus().type(customer.email)
      cy.get('@form').find('input[name="first-name"]').focus().type(customer.firstName)
      cy.get('@form').find('input[name="last-name"]').focus().type(customer.lastName)

      cy.get('@form').findByTestId('CreateAccountCheckbox')
        .should('be.visible')
        .click()

      cy.get('@form').find('select[name="gender"]')
        .should('be.visible')
        .selectRandomOption(true)

      cy.get('@form').find('input[name="dob"]').focus().type(customer.dob)
      cy.get('@form').find('input[name="password"]').focus().type(customer.password)
      cy.get('@form').find('input[name="password-confirm"]').focus().type(customer.password)

      cy.get('@form').findByTestId('NextStepButton').click()
    })

    cy.getCustomer().then(customer => {
      cy.get('#checkout .step-addresses .addresses').as('addresses')
      cy.get('@addresses').get('.address-shipping').as('shipping-address')

      cy.get('@shipping-address').find('input[name="street[0]"]').focus().type(customer.address.streetAddress())
      cy.get('@shipping-address').find('input[name="postcode"]').focus().type(customer.address.zipCode())
      cy.get('@shipping-address').find('input[name="city"]').focus().type(customer.address.city())
      cy.get('@shipping-address').find('input[name="telephone"]').focus().type(customer.phone.phoneNumber())

      cy.get('@addresses').findByTestId('NextStepButton').click()
      cy.waitForLoader(1000)
    })

    cy.getStoreCode().then(storeCode => {
      if (storeCode === 'de') {
        cy.get('#checkout .step-shipping .shipping').as('shipping')
        cy.get('@shipping').find('label[for="priorityHandling"]').randomlyClickElement()

        cy.get('@shipping').findByTestId('NextStepButton').click()
        cy.waitForLoader()
      }
    })

    cy.getCustomer().then(customer => {
      cy.get('#checkout .step-payment .payment').as('payment')

      cy.get('@payment').findByTestId('BankpaymentCheckbox').click()
      cy.get('@payment').findByTestId('BankpaymentForm').should('be.visible')

      cy.get('@payment').findByTestId('NextStepButton').click()
      cy.waitForLoader()
    })

    cy.getStoreCode().then(storeCode => {
      cy.get('#checkout .step-review .order-review').as('review')

      cy.get('@review').then(body => {
        if (body.find('label[for="terms"]').length > 0) {
          cy.get('label[for="terms"]').click(5, 5)
        }
      })

      cy.get('@review').findByTestId('PlaceOrderButton').click()

      cy.waitForLoader(30000)
      cy.url().should('include', `checkout-success`)

      cy.isLoggedIn()
    })
  })
})

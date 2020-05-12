describe('Customer', () => {
  it('registers an account and then adds an address', () => {
    cy.registerCustomer()

    cy.isLoggedIn()

    cy.openSidebar('[data-test-id="HeaderButtonAccount"]')
    cy.get('@sidebar').findByTestId('MyAddressesButton').click()

    cy.getByTestId('MyAddresses').should('be.visible')

    cy.getByTestId('AddNewAddressButton').click()
    cy.getByTestId('MyAddressesForm').as('form').should('be.visible')

    cy.getFaker().then(faker => {
      if (faker.random.number(1) > 0) {
        cy.get('@form').find('input[name="company"]').type(faker.company.companyName())
      }

      cy.get('@form').find('input[name="street[0]"]').type(faker.address.streetAddress())
      cy.get('@form').find('input[name="city"]').type(faker.address.city())
      cy.get('@form').find('input[name="postcode"]').type(faker.address.zipCode())
      cy.get('@form').find('input[name="telephone"]').type(faker.phone.phoneNumber())
      cy.get('@form').findByTestId('IsDefaultBillingCheckbox').randomlyClickElement()
      cy.get('@form').findByTestId('IsDefaultShippingCheckbox').randomlyClickElement()
      cy.get('@form').findByTestId('SubmitButton').click()

      cy.waitForLoader().checkNotification('success')

      cy.get('@form').findByTestId('BackButton').click()

      cy.getByTestId('MyAddresses')
        .should('be.visible')
        .findByTestId('AddressBox')
    })
  })
})

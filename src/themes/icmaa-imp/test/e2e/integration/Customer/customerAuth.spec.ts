describe('Customer', () => {
  it('register account, logout and login again', () => {
    cy.registerCustomer()

    cy.isLoggedIn()

    cy.openSidebar('[data-test-id="HeaderButtonAccount"]')
    cy.get('@sidebar').findByTestId('logoutButton').click()

    cy.isLoggedIn(false)

    cy.openSidebar('[data-test-id="HeaderButtonAccount"]', '[data-test-id="Modal"]')

    cy.getCustomer().then(customer => {
      cy.get('@sidebar').focusInput('email').type(customer.email)
      cy.get('@sidebar').focusInput('password').type(customer.password)
      cy.get('@sidebar').findByTestId('loginSubmit').click()
    })

    cy.waitForLoader()
      .checkNotification('success')

    cy.isLoggedIn()
  })
})

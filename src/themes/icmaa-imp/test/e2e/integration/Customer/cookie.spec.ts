describe('Cookie-Notice', () => {
  it('accept essential cookies', () => {
    cy.visit('/')
      .hideLanguageModal()
      .reload()

    cy.getByTestId('CookieNotification')
      .should('be.visible')
      .find('button').last().click()

    cy.getByTestId('CookieNotification')
      .should('not.be.visible')
  })

  it('accept all cookies', () => {
    cy.visit('/')
      .hideLanguageModal()
      .reload()

    cy.getByTestId('CookieNotification')
      .should('be.visible')
      .find('button').each(el => el.click())

    cy.getByTestId('CookieNotification')
      .should('not.be.visible')
  })

  it('hide cookie notification on service page', () => {
    cy.visit('/')
      .hideLanguageModal()
      .reload()

    cy.getByTestId('CookieNotification')
      .should('be.visible')
      .find('a').first().click()

    cy.getByTestId('CookieNotification')
      .should('not.be.visible')

    cy.visit('/')
    cy.getByTestId('CookieNotification')
      .should('be.visible')
  })
})

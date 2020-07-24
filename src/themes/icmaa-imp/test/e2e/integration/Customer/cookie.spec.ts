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

    cy.getFromLocalStorage('shop/uniClaims/cookiesAccepted')
      .then(claim => {
        expect(claim).to.contain('"value":false', 'Cookie for Cookies-Accept-Claim is false')
      })
  })

  it('accept all cookies', () => {
    cy.visit('/')
      .hideLanguageModal()
      .reload()

    cy.getByTestId('CookieNotification')
      .should('be.visible')
      .find('button').first().click()

    cy.getByTestId('CookieNotification')
      .should('not.be.visible')

    cy.getFromLocalStorage('shop/uniClaims/cookiesAccepted')
      .then(claim => {
        expect(claim).to.contain('"value":true', 'Cookie for Cookies-Accept-Claim is false')
      })
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

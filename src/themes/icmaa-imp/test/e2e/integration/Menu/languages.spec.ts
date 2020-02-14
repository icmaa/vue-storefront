describe('Language selector', () => {
  it('Modal popup as new user', () => {
    cy.visit('/')

    // Only show modal if browser language != storecode
    cy.getStoreCode().then((storeCode) => {
      cy.window().then((win) => {
        const language = win.navigator.language.split('-')[0].toLocaleLowerCase()
        if (language === storeCode) {
          cy.getByTestId('Modal').should('not.be.visible')
        } else {
          cy.getByTestId('Modal').should('be.visible')
        }
      })
    })
  })

  it('Language modal should show', () => {
    cy.visitAsRecurringUser('/')

    // Click language icon
    cy.openNavigationSidebar()
      .getByTestId('SidebarMenuFooter')
      .find('svg')
      .click()

    // Language model should be visible
    cy.getByTestId('Modal')
      .should('be.visible')

    // check href attribute and number of <a> elements
    cy.getByTestId('Modal').find('a')
      .should('have.length.gt', 0)
      .random()
      .should('have.attr', 'href')
      .should('include', 'www.impericon.com/')
  })
})

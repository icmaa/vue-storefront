describe('Language selector', () => {
  it('Language modal should show', () => {
    cy.visitAsRecurringUser('/')

    // Click language icon
    cy.openNavigationSidebar()
      .getByTestId('SidebarMenuFooter')
      .find('svg')
      .click()

    // Language model should be visible
    cy.get('.modal-content')
      .should('be.visible')

    // check href attribute and number of <a> elements
    cy.get('.modal-content a')
      .should('have.length', 20)
      .random()
      .should('have.attr', 'href')
      .should('include', 'www.impericon.com/')
  })
})

describe('Menu sidebar footer', () => {
  it('Footer navigation in menu sidebar', () => {
    cy.visitAsRecurringUser('/')
    cy.openNavigationSidebar()

    // Footer navigation should be visible
    cy.get('@sidebar')
      .find('[data-test-id="SidebarMenuFooter"]')
      .should('be.visible')
      .find('a')
      .random()
      .as('link')
      .should('have.attr', 'href')
      .then(href => {
        cy.get('@link').click()
        cy.location('pathname').should('be.eq', href) // Missing check for status yet
      })
  })
})

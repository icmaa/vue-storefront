describe('Menu sidebar footer', () => {
  it('Footer navigation in menu sidebar', () => {
    cy.visitAsRecurringUser('/')

    // Click menu button
    cy.get('button[aria-label="Menu"]')
      .should('be.visible')
      .as('menu')
      .click()

    // Footer navigation should be visible
    cy.get('@menu').get('[data-test-id="SidebarMenuFooter"]')
      .should('be.visible')
      .find('a')
      .first()
      .click()

    // Click first link
    cy.url().should('include', '/festival')
  })
})

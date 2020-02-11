describe('Menu sidebar', () => {
  it('Sidebar should be visible and contain links', () => {
    cy.visitAsRecurringUser('/')

    // Click menu button
    cy.get('button[aria-label="Menu"]')
      .should('be.visible')
      .click()

    // Sidebar should show up
    cy.get('[data-test-id="Sidebar"]')
      .as('menu')
      .should('be.visible')

    // Check if all links exist
    cy.get('@menu')
      .find('a')
      .should('have.length', 15)

    // Check new products link
    cy.get('@menu')
      .find('a')
      .first()
      .as('new')
      .should('have.attr', 'href')
      .and('include', '/new')

    // Click new products link
    cy.get('@new').click()

    // Should be on new products page now
    cy.url().should('include', '/new')
  })
})

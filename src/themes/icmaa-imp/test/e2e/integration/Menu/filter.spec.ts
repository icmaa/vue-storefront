describe('Filter', () => {
  it('Filter sidebar should be visible', () => {
    cy.visitAsRecurringUser('/girls.html')
    cy.get('[data-test-id="ButtonFilter"]')
      .should('be.visible')
      .click()
  })

  it('Select department filter', () => {
    cy.visitAsRecurringUser('/girls.html')
    cy.openFilterMenu()

    cy.get('.sidebar-content').find('[data-attribute-key="department"] button')
      .random()
      .click()

    cy.url().should('include', '?department=')
  })

  it('Select gender filter', () => {
    cy.visitAsRecurringUser('/girls.html')
    cy.openFilterMenu()

    cy.get('.sidebar-content').find('[data-attribute-key="gender"] button')
      .random()
      .click()

    cy.url().should('include', '?gender=')
  })
})

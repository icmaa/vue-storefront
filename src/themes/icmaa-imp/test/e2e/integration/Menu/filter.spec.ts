describe('Filter', () => {
  it('Select department filter', () => {
    cy.visitAsRecurringUser('/girls.html')
    cy.openFilterSidebar()

    cy.get('.sidebar-content').find('[data-attribute-key="department"] button')
      .clickRandomElement()

    cy.url().should('include', '?department=')
  })

  it('Select gender filter', () => {
    cy.visitAsRecurringUser('/girls.html')
    cy.openFilterSidebar()

    cy.get('.sidebar-content').find('[data-attribute-key="gender"] button')
      .clickRandomElement()

    cy.url().should('include', '?gender=')
  })

  it('Select multiple colors', () => {
    cy.visitAsRecurringUser('/girls.html')
    cy.openFilterSidebar()

    cy.get('.sidebar-content').find('[data-attribute-key="color"] button')
      .first()
      .click()

    cy.get('.sidebar-content').find('[data-attribute-key="color"] button')
      .last()
      .click()

    cy.url().should('include', '?color=').and('include', '&color=')
  })
})

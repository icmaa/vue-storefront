describe('Service-Imprint', () => {
  it('Check Service-Imprint and Navigation', () => {
    // Check Imprint
    cy.visitAsRecurringUser('/service-imprint')
    // Check Service Navigation
    cy.get('.service-navigation')
    // Check random Link in Service-Navigation (mobile only)
    cy.get('.service-navigation').click().find('li ul:last-child li a').random().click()
  })
})

describe('Service-Imprint', () => {
  it('Check Service-Imprint and Navigation', () => {
    // Check Imprint
    cy.visitAsRecurringUser('/service-imprint')
    // Check Service Navigation
    cy.get('.service-navigation')
    // Check fourth Link in Service-Navigation (mobile only)
    cy.get('.service-navigation').click().find('li ul:last-child li:nth-child(4) a').click()
  })
})

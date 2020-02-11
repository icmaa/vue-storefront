describe('Footer', () => {
  it('Footer should be visible', () => {
    cy.visitAsRecurringUser('/')
    cy.get('footer').should('be.visible')
  })

  it('Social media links should be visible in footer', () => {
    cy.visitAsRecurringUser('/')
    cy.get('footer .social-media').should('be.visible')
    cy.get('footer .social-media a')
      .should('have.length', 6)
  })

  it('Service carrier should be visible in footer', () => {
    cy.visitAsRecurringUser('/')
    cy.get('footer .service-carrier')
      .should('be.visible')
  })

  it('Navigation should be visible in footer', () => {
    cy.visitAsRecurringUser('/')
    cy.get('footer .footer-navigation')
      .should('be.visible')
      .find('a')
      .should('have.length', 7)
  })
})

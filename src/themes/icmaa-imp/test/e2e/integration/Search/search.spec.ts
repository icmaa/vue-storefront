describe('Search', () => {
  it('for "Heaven Shall Burn" and its alias "HSB" in search sidebar', () => {
    cy.visitAsRecurringUser('/', { storeCode: 'de' })

    cy.openSidebar('[data-test-id="SearchInput"]')
    cy.get('@sidebar').findByTestId('SearchInput').as('searchInput')
      .wait(500)
      .type('HSB')

    cy.get('@sidebar')
      .findByTestId('ProductTile')
      .should('have.length.gte', 1)
      .as('target')

    cy.get('@target')
      .then(listing => {
        const countTarget = Cypress.$(listing).length

        cy.get('@searchInput').clear().type('Heaven Shall Burn')
        cy.get('@sidebar').findByTestId('ProductTile').as('alias')

        cy.get('@alias')
          .then(listing => {
            const countAlias = Cypress.$(listing).length
            expect(countAlias).to.eql(countTarget)
          })
      })

    cy.get('@searchInput').type(' Endzeit')
    cy.get('@sidebar')
      .findByTestId('ProductTile')
  })
})

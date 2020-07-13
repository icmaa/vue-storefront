describe('Search and SearchAliases', () => {
  it('Search Pants and his Alias Hosen', () => {
    cy.visitAsRecurringUser('/', { storeCode: 'de' })

    cy.openSidebar('[data-test-id="SearchInput"]')
    cy.get('@sidebar').find('input').as('searchInput')
      .type('HSB')

    cy.get('@sidebar')
      .findByTestId('ProductTile')
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

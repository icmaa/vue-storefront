describe('Search', () => {
  it('and go to result-page', () => {
    cy.visitAsRecurringUser('/', { storeCode: 'de' })

    cy.openSidebar('[data-test-id="SearchInput"]')
    cy.get('@sidebar').findByTestId('SearchInput').as('searchInput')
      .type('HSB')

    cy.get('@sidebar')
      .findByTestId('ProductTile')
      .should('have.length.gte', 1)
      .as('target')

    cy.get('@target')
      .then(listing => {
        const countTarget = Cypress.$(listing).length

        cy.get('@sidebar')
          .findByTestId('ShowAllButton')
          .click()

        cy.getByTestId('ProductListing').findByTestId('ProductTile')
          .then(listing => {
            const countAlias = Cypress.$(listing).length
            expect(countAlias).to.gte(countTarget)
          })
      })
  })
})

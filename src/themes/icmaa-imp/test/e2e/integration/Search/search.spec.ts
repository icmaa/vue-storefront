describe('Search and SearchAliases', () => {
  it('Search Pants and his Alias Hosen', () => {
    cy.visitAsRecurringUser('/', { storeCode: 'de' })
    cy.getByTestId('SearchInput').click()
    cy.getByTestId('Sidebar').find('input').type('Pants')
    cy.getByTestId('Sidebar').findByTestId('ProductTile').as('target')

    cy.get('@target')
      .then(listing => {
        const countTarget = Cypress.$(listing).length

        cy.visitAsRecurringUser('/', { storeCode: 'de' })
        cy.getByTestId('SearchInput').click()
        cy.getByTestId('Sidebar').find('input').type('Hosen')
        cy.getByTestId('Sidebar').findByTestId('ProductTile').as('alias')

        cy.get('@alias')
          .then(listing => {
            const countAlias = Cypress.$(listing).length
            expect(countAlias).to.eql(countTarget)
          })
      })
  })
})

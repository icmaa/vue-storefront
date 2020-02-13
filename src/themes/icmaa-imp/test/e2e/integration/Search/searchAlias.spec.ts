describe('SearchAlias', () => {
  it('Search Pants', () => {
    cy.visitAsRecurringUser('/')
    cy.get('[data-test-id="SearchInput"]').click()
    cy.get('[data-test-id="SearchPanel"]').find('input').type('Pants')
    cy.get('[data-test-id="SearchPanel"] [data-test-id="ProductTile"]').log('search')
  })
  it('Search Hosen', () => {
    cy.visitAsRecurringUser('/')
    cy.get('[data-test-id="SearchInput"]').click()
    cy.get('[data-test-id="SearchPanel"]').find('input').type('Hosen')
    cy.get('[data-test-id="SearchPanel"] [data-test-id="ProductTile"]').log('searchAlias')
  })
})

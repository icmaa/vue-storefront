describe('SearchAlias', () => {
  it('Search Pants', () => {
    cy.visitAsRecurringUser('/')
    cy.getByTestId('SearchInput').click()
    cy.getByTestId('Sidebar').find('input').type('Pants')
    cy.getByTestId('Sidebar').findByTestId('ProductTile').log('search')
  })
  it('Search Hosen', () => {
    cy.visitAsRecurringUser('/')
    cy.getByTestId('SearchInput').click()
    cy.getByTestId('Sidebar').find('input').type('Hosen')
    cy.getByTestId('Sidebar').findByTestId('ProductTile').log('search')
  })
})

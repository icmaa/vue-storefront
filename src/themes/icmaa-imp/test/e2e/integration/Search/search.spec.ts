describe('Search', () => {
  it('Search', () => {
    cy.visitAsRecurringUser('/')
    cy.get('[data-test-id="SearchInput"]').click()
    cy.get('[data-test-id="searchSidebar"]').find('input').type('Shirt')
    cy.get('[data-test-id="ProductTile"]')
  })
})

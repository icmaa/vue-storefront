describe('Search', () => {
  it('Search', () => {
    cy.visitAsRecurringUser('/')
    cy.get('[data-test-id="SearchInput"]').click()
    cy.get('[data-test-id="SearchPanel"]').find('input').type('Shirt')
    cy.get('[data-test-id="ProductTile"]').find('img').each(e => cy.wrap(e).checkImage())
  })
})

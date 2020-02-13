describe('Recommendations', () => {
  it('Recommendations should be visible', () => {
    // Click random product
    cy.visitAsRecurringUser('/new', { storeCode: 'de' })
      .getByTestId('productLink')
      .random()
      .click()

    // Product has recommendations
    cy.getByTestId('Recommendations')
      .as('recommendations')
      .findByTestId('ProductTile')
      .find('img')
      .each(e => cy.wrap(e).checkImage())

    // Recommendation have link element
    cy.get('@recommendations')
      .findByTestId('productLink')
      .random()
      .should('have.attr', 'href')
  })
})

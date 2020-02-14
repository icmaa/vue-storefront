describe('Recommendations', () => {
  it('Recommendations should be visible', () => {
    // Click random product
    cy.visitCategoryPage()
      .getByTestId('ProductTile')
      .random()
      .findByTestId('productLink')
      .click()

    // Product has recommendations
    cy.getByTestId('Recommendations')
      .as('recommendations')
      .findByTestId('ProductTile')
      .random()
      .find('img')
      .each(e => cy.wrap(e).checkImage())

    // Recommendation has link
    cy.get('@recommendations')
      .findByTestId('productLink')
      .random()
      .should('have.attr', 'href')
      .and('have.length.gt', 0)
  })
})

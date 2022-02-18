describe('Recommendations', () => {
  it('Recommendations should be visible', () => {
    cy.visitProductDetailPage()

    cy.getByTestId('RecommendationsLoader')
      .first()
      .scrollIntoView({ offset: { top: 0, left: 0 } })

    cy.getByTestId('Recommendations')
      .as('recommendations')
      .findByTestId('ProductTile')
      .random()
      .find('img')
      .each(e => cy.wrap(e).checkImage())

    cy.get('@recommendations')
      .findByTestId('productLink')
      .random()
      .should('have.attr', 'href')
      .and('have.length.gt', 0)
  })
})

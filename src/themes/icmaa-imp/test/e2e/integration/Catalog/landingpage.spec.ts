describe('Productlisting', () => {
  it('Teaser, Logoline and Productlistings should be visible on CategoryPages', () => {
    cy.visitCategoryPage()
    cy.getByTestId('TeaserSmall').should('have.length.gt', 0)
    cy.getByTestId('TeaserSmall').find('img').each(e => cy.wrap(e).checkImage())
    cy.getByTestId('LogoLine').should('have.length.gt', 0)
    cy.getByTestId('LogoLine').find('img').each(e => cy.wrap(e).checkImage())
    cy.getByTestId('ProductListing').find('img').each(e => cy.wrap(e).checkImage())
  })
})

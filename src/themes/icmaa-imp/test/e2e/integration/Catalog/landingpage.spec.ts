describe('Productlisting', () => {
  it('Teaser, Logoline and Productlistings should be visible on CategoryPages', () => {
    cy.visitCategoryPage()

    // if Teaser
    cy.get('#app').then(($selector) => {
      if ($selector.find('div[data-test-id="TeaserSmall"]').length > 0) {
        cy.getByTestId('TeaserSmall').find('img').each(e => cy.wrap(e).checkImage())
      }
    })

    // if Logoline
    cy.get('#app').then(($selector) => {
      if ($selector.find('div[data-test-id="LogoLine"]').length > 0) {
        cy.getByTestId('LogoLine').find('img').each(e => cy.wrap(e).checkImage())
      }
    })

    cy.getByTestId('ProductListing').find('img').each(e => cy.wrap(e).checkImage())
  })
})

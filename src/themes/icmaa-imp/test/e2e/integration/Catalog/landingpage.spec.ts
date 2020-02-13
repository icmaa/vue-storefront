describe('Productlisting', () => {
  it('Teaser, Logoline and Productlistings should be visible on New', () => {
    cy.visitAsRecurringUser('/new')

    // if Teaser
    cy.get('#app').then(($selector) => {
      if ($selector.find('div[data-test-id="TeaserSmall"]').length > 0) {
        cy.get('[data-test-id="TeaserSmall"]').find('img').each(e => cy.wrap(e).checkImage())
      }
    })

    // if Logoline
    cy.get('#app').then(($selector) => {
      if ($selector.find('div[data-test-id="LogoLine"]').length > 0) {
        cy.get('[data-test-id="LogoLine"]').find('img').each(e => cy.wrap(e).checkImage())
      }
    })

    cy.get('[data-test-id="ProductListing"]').find('img').each(e => cy.wrap(e).checkImage())
  })
})

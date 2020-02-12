describe('Homepage', () => {
  it('Check HomePage with all Elements (Fullsize-Teaser, Split-Teaser und Teaser, LogoLines, ProductListings', () => {
    cy.visitAsRecurringUser('/')
    // Fullsize-Teaser is a Image with "teaser" in img src
    cy.get('[data-test-id="TeaserFullsize"] > div > img').checkImage()
    // Split-Teaser is a Image with "teaser" in img src
    cy.get('[data-test-id="TeaserSplit"] > img').checkImage()
    // Teaser is a Image with "teaser" in img src
    cy.get('[data-test-id="TeaserSmall"] > img').checkImage()
    // 2 LogoLineBlocks
    cy.get('[data-test-id="LogoLineBlock"]').should('have.length', 2)
    // 2 LogoLines
    cy.get('[data-test-id="LogoLine"]').should('have.length', 2)
    // 24 LogoItems
    cy.get('[data-test-id="DepartmentLogo"]').should('have.length', 24)
    // LogoItems is a Image with "department-logos" in img src
    cy.get('[data-test-id="DepartmentLogo"]').find('img').each(e => cy.wrap(e).checkImage())
    // 2 ProductListings
    cy.get('[data-test-id="ProductListingWidget"]').should('have.length', 2)
    // 2x4 ProductTiles
    cy.get('div[data-test-id="ProductListingWidget"]').find('[data-test-id="ProductTile"]').should('have.length', 8)
  })
})

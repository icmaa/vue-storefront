import { finished } from 'stream'

describe('Homepage', () => {
  it('Check HomePage with all Elements (Fullsize-Teaser, Split-Teaser und Teaser, LogoLines, ProductListings', () => {
    cy.visitAsRecurringUser('/')
    // Fullsize-Teaser is a Image with "teaser" in img src
    cy.getByTestId('TeaserFullsize').scrollIntoView().findImageWithPlaceholder('div > picture > img').checkImage()
    // Split-Teaser is a Image with "teaser" in img src
    cy.getByTestId('TeaserSplit').first().scrollIntoView().findImageWithPlaceholder().checkImage()
    // Teaser is a Image with "teaser" in img src
    cy.getByTestId('TeaserSmall').first().scrollIntoView().findImageWithPlaceholder().checkImage()
    // 2 LogoLineBlocks
    cy.getByTestId('LogoLineBlock').should('have.length', 2)
    // 2 LogoLines
    cy.getByTestId('LogoLine').should('have.length', 2)
    // 24 LogoItems
    cy.getByTestId('DepartmentLogo').should('have.length', 24)
    // 2 ProductListings
    cy.getByTestId('ProductListingWidget').should('have.length', 2)
    // 2x4 ProductTiles
    cy.getByTestId('ProductListingWidget').findByTestId('ProductTile').should('have.length', 8)
  })
})

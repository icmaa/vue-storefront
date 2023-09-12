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
    cy.getByTestId('LogoLineBlockLoader').scrollIntoView()
    cy.getByTestId('LogoLineBlock').should('have.length', 3)
    // 2 LogoLines
    cy.getByTestId('LogoLine').should('have.length', 3)
    // 24 LogoItems
    cy.getByTestId('DepartmentLogo').should('have.length', 27)
    // At least 1 ProductListings (as the second might be hidden)
    cy.getByTestId('ProductListingWidget').should('have.length.least', 1)
    // At least 1x4 ProductTiles
    cy.getByTestId('ProductListingWidget').findByTestId('ProductTile').should('have.length.least', 8)
  })
})

describe('Homepage', () => {
  it('Fullsize-Teaser should be visible on homepage', () => {
    cy.visit('/')
    cy.get('[data-test-id="TeaserFullsize"]').should('be.visible')
  })

  it('Split-Teaser should be visible on homepage', () => {
    cy.visit('/')
    cy.get('[data-test-id="TeaserSplit"]').should('be.visible')
  })

  it('Teaser should be visible on homepage', () => {
    cy.visit('/')
    cy.get('[data-test-id="Teaser"]').should('be.visible')
  })

  it('Logoline should be visible in two blocks on homepage', () => {
    cy.visit('/')
    cy.get('[data-test-id="LogoLineBlock"]').should('have.length', 2)
  })

  it('Product-Listing should be visible in two blocks on homepage', () => {
    cy.visit('/')
    cy.get('[data-test-id="ProductListingWidget"]').should('have.length', 2)
  })

  it('Product-Listing should be have 2x4 Products on homepage', () => {
    cy.visit('/')
    cy.get('[data-test-id="ProductListingWidget"] [data-test-id="ProductTile"] ').should('have.length', 8)
  })
})

describe('CLP', () => {
  it('has Teaser and Productlistings should be visible', () => {
    cy.visitCategoryPage()

    cy.getByTestId('ProductListing')
      .findImageWithPlaceholder()
      .each(e => cy.wrap(e).scrollIntoView().checkImage())
  })

  it('has products and valid department filter', () => {
    cy.visitCategoryPage()

    cy.getByTestId('productsTotal').then((element) => {
      const productsTotalNumber = parseInt(element.text())

      cy.openFilterSidebar()
      cy.get('@sidebar')
        .find('[data-attribute-key="department"] button')
        .random()
        .scrollIntoView({ offset: { top: -200, left: 0 }, duration: 1000 })
        .click({ force: true })

      cy.url().should('include', `?department=`)

      cy.closeSidebar()

      cy.getByTestId('productsTotal').should((element) => {
        const productsTotalFiltered = parseInt(element.text())
        expect(productsTotalFiltered).lte(productsTotalNumber)
      })
    })
  })
})

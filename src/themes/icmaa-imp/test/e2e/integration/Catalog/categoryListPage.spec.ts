describe('CLP', () => {
  it('has Teaser and Productlistings should be visible', () => {
    cy.visitCategoryPage()

    cy.getByTestId('ProductListing')
      .findImageWithPlaceholder()
      .each(e => cy.wrap(e).scrollIntoView({ duration: 0 }).checkImage())
  })

  it('has products and valid department filter', () => {
    cy.visitCategoryPage()

    cy.getByTestId('productsTotal').then((element) => {
      const productsTotalNumber = parseInt(element.text())

      cy.openFilterSidebar()
      cy.get('@sidebar')
        .find('[data-attribute-key="department"] button')
        .random()
        .scrollIntoView()
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

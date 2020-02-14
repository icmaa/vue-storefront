describe('Filter', () => {
  it('Select department filter', () => {
    cy.visitAsRecurringUser('/girls.html')
    cy.openFilterSidebar()

    // compare product totals before and after a filter is selected
    cy.getByTestId('productsTotal').then((element) => {
      const productsTotalNumber = parseInt(element.text())

      // Select deparment filter
      cy.get('@sidebar').find('[data-attribute-key="department"] button')
        .clickRandomElement()

      cy.getByTestId('productsTotal').should((element) => {
        const productsTotalFiltered = parseInt(element.text())
        expect(productsTotalNumber).gt(productsTotalFiltered)
      })
    })

    cy.url().should('include', `?department=`)
  })
})

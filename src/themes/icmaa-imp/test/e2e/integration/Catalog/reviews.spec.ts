describe('Reviews', () => {
  it('Select random product and create review', () => {
    cy.visitAsRecurringUser('')
      .visitProductDetailPage()

    cy.getByTestId('Reviews')
      .find('button')
      .scrollIntoView({ offset: { top: -200, left: 0 }, duration: 1000 })
      .click({ force: true })

    cy.get('#reviews-form').should('be.visible')

    cy.getFaker().then(faker => {
      cy.get('input[name="name"]').type(faker.name.firstName())
      cy.get('input[name="email"]').type(faker.internet.email())
      cy.get('#rating').selectRandomOption(true)
      cy.get('input[name="summary"]').type('Lorem ipsum')
      cy.get('textarea[name="review"]').type('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod')
      cy.get('form button').click()
    })

    cy.waitForLoader()
      .checkNotification('success')
  })

  it('See review claim and click it away', () => {
    cy.visitAsRecurringUser('')
      .visitProductDetailPage()

    cy.getByTestId('ReviewsClaim').should('be.visible')
    cy.getByTestId('ReviewsClaimAccept').click()
    cy.getByTestId('ReviewsClaim').should('not.be.visible')
    cy.get('#reviews-form').should('be.visible')

    cy.getFromLocalStorage('shop/uniClaims/reviewsClaimAccepted')
      .then(claim => {
        expect(claim).to.contain('"value":true', 'Cookie for Review-Claim is true')
      })
  })
})

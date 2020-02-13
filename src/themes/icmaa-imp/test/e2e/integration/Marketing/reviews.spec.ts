describe('Reviews', () => {
  it('Select random product and create review', () => {
    cy.visitAsRecurringUser('/new', { storeCode: 'de' })
      .getByTestId('productLink')
      .clickRandomElement()

    cy.getByTestId('Reviews')
      .find('button')
      .click()

    cy.get('#reviews-form').should('be.visible')

    cy.getFaker().then(faker => {
      cy.get('input[name="name"]').type(faker.name.firstName())
      cy.get('input[name="email"]').type(faker.internet.email())
      cy.get('#rating').selectRandomOption()
      cy.get('input[name="summary"]').type('Lorem ipsum')
      cy.get('textarea[name="review"]').type('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod')
      cy.get('form button').click()
    })

    cy.waitForLoader()
      .checkNotification('success')
  })
})

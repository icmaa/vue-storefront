describe('Landingpage Tickets ', () => {
  it(`Tourposter on Tickes Landingpage`, () => {
    cy.visitAsRecurringUser('/tickets')
    cy.getByTestId('Tickets').find('img').each(e => cy.wrap(e).checkImage())
  })
})

// TODO - Tickets only in DACH???

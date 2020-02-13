describe('Landingpage Tickets ', () => {
  it(`Tourposter on Tickes Landingpage`, () => {
    cy.visitAsRecurringUser('/tickets')
    cy.get('[data-test-id="Tickets"]').find('img').each(e => cy.wrap(e).checkImage())
  })
})

// TODO - Tickets only in DACH???

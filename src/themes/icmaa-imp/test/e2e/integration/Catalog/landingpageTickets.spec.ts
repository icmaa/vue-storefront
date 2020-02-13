describe('Landingpage Tickets ', () => {
  it(`Tourposter on Tickes Landingpage`, () => {
    cy.visitAsRecurringUser('/tickets', { storeCode: 'de' })
    cy.getByTestId('Tickets').find('img').each(e => cy.wrap(e).checkImage())
  })
})

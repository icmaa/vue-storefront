describe('widerruf-formular', () => {
  it('Check Form', () => {
    cy.visitAsRecurringUser('/widerruf-formular')
    cy.get('input#order_number').click().type('Order-Number')
    cy.get('input#order_date').click().type('02.02.2020')
    cy.get('input#widerruf_date').click().type('02.02.2020')
    cy.get('input#name').click().type('A9')
    cy.get('input#email').click().type('a9+tests+cypress@impericon.com')
    cy.get('textarea#address').click().type('Address for Acceptance Testing')
    // todo captcha
    // todo id for Button
    cy.get('button[type="submit"]').click()
  })
})

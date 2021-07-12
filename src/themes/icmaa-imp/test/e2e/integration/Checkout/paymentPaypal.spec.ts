describe('Checkout', () => {
  it('as guest customer and use PayPal payment.', () => {
    cy.createCartAndGoToCheckout()
    cy.checkoutFillPersonalDetails()
    cy.checkoutFillAddress()
    cy.checkoutFillShipping()

    cy.checkoutFillPayment('CheckoutcomApmPaypal')

    cy.checkoutPlaceOrder(true)
    cy.url().should('contain', 'paypal.com')

    cy.get('form.proceed').as('ppLoginForm')
    cy.get('@ppLoginForm').find('input[name="login_email"]').clear().type('sb-jr6uf6662196@personal.example.com')
    cy.get('@ppLoginForm').find('input[name="login_password"]').type('imP12QWas')
    cy.get('@ppLoginForm').find('button#btnLogin').click()

    /** @todo PayPal is redirecting the whole page and we're losing cypress with that */

    cy.get('#payment-submit-btn').click()

    cy.isLoggedIn(false)
  })
})

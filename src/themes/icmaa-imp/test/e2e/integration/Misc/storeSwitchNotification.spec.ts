import Settings from '../../support/utils/Settings'

const { _ } = Cypress

describe('Notification for Store switch', () => {
  it('shows up after switching stores', () => {
    cy.visitAsRecurringUser('/')

    // Only run test if this feature is enabled
    cy.get<string>('@storeCode').then(storeCode => {
      const storeViews: any = Settings.availableStoreViews.filter(l => l !== storeCode)
      storeCode = _.sample(storeViews)

      cy.setStoreCode(storeCode)

      cy.visit('/', { storeCode })
    })

    cy.getByTestId('ModalStoreViewAdvice').scrollIntoView().should('be.visible')
    cy.getByTestId('ModalClose').click()
    cy.getByTestId('Modal').should('not.exist')

    cy.getFromLocalStorage('shop/uniClaims/languageAccepted')
      .then(claim => {
        cy.get<string>('@storeCode').then(storeCode => {
          expect(claim).to.contain(`"storeCode":"${storeCode}"`, 'New store code is in localstorag true')
        })
      })
  })
})

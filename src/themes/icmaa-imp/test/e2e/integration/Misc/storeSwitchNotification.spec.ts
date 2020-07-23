import Settings from '../../support/utils/Settings'

const { _ } = Cypress

describe('Notification for Store switch', () => {
  it('shows up after switching stores', () => {
    cy.visitAsRecurringUser('/')

    cy.get<string>('@storeCode').then(storeCode => {
      const storeViews: any = Settings.availableStoreViews.filter(l => l !== storeCode)
      storeCode = _.sample(storeViews)

      cy.setStoreCode(storeCode)

      cy.visit('/', { storeCode })
    })

    cy.getByTestId('ModalStoreViewAdvice').should('be.visible')
    cy.getByTestId('ModalClose').click()
    cy.getByTestId('Modal').should('not.be.visible')

    cy.getFromLocalStorage('shop/uniClaims/languageAccepted')
      .then(claim => {
        // { "code": "languageAccepted", "created_at": "2020-07-23T09:17:34.003Z", "value": { "accepted": true, "storeCode": "es" } }
        cy.get<string>('@storeCode').then(storeCode => {
          expect(claim).to.contain(`"storeCode":"${storeCode}"`, 'New store code is in localstorag true')
        })
      })
  })
})

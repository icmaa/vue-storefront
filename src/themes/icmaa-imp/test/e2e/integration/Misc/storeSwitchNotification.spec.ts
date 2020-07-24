import Settings from '../../support/utils/Settings'

const { _ } = Cypress

const getInitialState = () => cy.window().its('__INITIAL_STATE__')

describe('Notification for Store switch', () => {
  it('shows up after switching stores', () => {
    cy.visitAsRecurringUser('/')

    getInitialState()
      .its<string>('config.icmaa.storeViewSwitch.showAdvice')
      .then(enabled => {
        cy.log('The store-view-switch notification is ' + (enabled ? 'enabled' : 'disabled'))

        // Only run test if this feature is enabled
        if (enabled) {
          cy.get<string>('@storeCode').then(storeCode => {
            const storeViews: any = Settings.availableStoreViews.filter(l => l !== storeCode)
            storeCode = _.sample(storeViews)

            cy.setStoreCode(storeCode)

            cy.visit('/', { storeCode })
          })

          cy.getByTestId('ModalStoreViewAdvice').scrollIntoView().should('be.visible')
          cy.getByTestId('ModalClose').click()
          cy.getByTestId('Modal').should('not.be.visible')

          cy.getFromLocalStorage('shop/uniClaims/languageAccepted')
            .then(claim => {
              cy.get<string>('@storeCode').then(storeCode => {
                expect(claim).to.contain(`"storeCode":"${storeCode}"`, 'New store code is in localstorag true')
              })
            })
        }
      })
  })
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Settings from './utils/Settings'
import Faker, { getIcmaaEmail, getBirthday } from './utils/Faker'

const { _ } = Cypress

Cypress.Commands.add('getFaker', () => {
  cy.getStoreCode().then(storeCode => {
    cy.wrap(Faker(storeCode)).as('faker')
  })
})

Cypress.Commands.add('createCustomerWithFaker', () => {
  cy.getFaker().then(faker => {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: getIcmaaEmail(),
      password: faker.internet.password(10, true),
      dob: getBirthday()
    }

    Object.assign(faker, data)

    cy.wrap(faker).as('customer')
  })
})

Cypress.Commands.add(
  'random',
  { prevSubject: 'element' },
  subject => cy.wrap(subject).eq(Math.floor(Math.random() * subject.length))
)

Cypress.Commands.add(
  'clickRandomElement',
  { prevSubject: 'element' },
  (subject) => {
    cy.wrap(subject).random().click()
  }
)

Cypress.Commands.add(
  'selectRandomOption',
  { prevSubject: 'element' },
  (subject, skipFirst = false) => {
    const selector = skipFirst ? 'option:not(:first-child)' : 'option'
    cy.wrap(subject).within(() => {
      cy.root().children(selector).random()
        .then(e => {
          cy.root().select(e.val())
        })
    })
  }
)

Cypress.Commands.add('randomlyClickElement', { prevSubject: 'element' }, (subject) => {
  const click = (Faker().random.number(1) > 0)
  if (click) {
    cy.wrap(subject).click()
  } else {
    cy.log('I decided not to click the prev element')
  }
})

Cypress.Commands.add('checkImage', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject)
    .should('be.visible')
    .and($img => expect($img[0].naturalWidth).to.be.greaterThan(0))
})

Cypress.Commands.add('getByTestId', (id, options) => {
  cy.get(`[data-test-id="${id}"]`, options)
})

Cypress.Commands.add('findByTestId', { prevSubject: 'element' }, (subject, id) => {
  cy.wrap(subject)
    .find(`[data-test-id="${id}"]`)
})

Cypress.Commands.overwrite('scrollIntoView', (originalFn, subject, options) => {
  const defaults = { offset: { top: -400 }, duration: 300 }
  options = Object.assign({}, defaults, options)
  return originalFn(subject, options)
})

Cypress.Commands.add('getFromLocalStorage', (key) => {
  cy.window().then(window => {
    cy.wrap(window.localStorage.getItem(key))
  })
})

Cypress.Commands.overwrite('visit', (originalFn, url, options?) => {
  let storeCode: string
  if (options?.hasOwnProperty('storeCode') && options?.storeCode !== undefined) {
    storeCode = options.storeCode
    cy.setStoreCode(storeCode)
  }

  cy.getStoreCode().then(hasStoreCode => {
    if (!hasStoreCode) {
      cy.setStoreCode(storeCode)
    }
  })

  if (options?.returningVisitor) {
    cy.hideLanguageModal()
      .acceptCookieNotice()
  }

  cy.getStoreCode().then(storeCode => {
    if (!url.startsWith('/')) {
      url = '/' + url
    }

    url = `${storeCode}${url}`

    options = _.omit(options, ['storeCode', 'returningVisitor'])
    cy.then(() => originalFn(url, options))
  })
})

Cypress.Commands.add('visitAsRecurringUser', (url, options?) => {
  options = Object.assign({ returningVisitor: true }, options)
  cy.visit(url, options)
})

Cypress.Commands.add('visitCategoryPage', (options?) => {
  let url = Settings.randomCategoryPage
  if (options && options.url) {
    url = options.url
    delete options.url
  }

  cy.wrap<string>(url)
    .as('categoryEntryPointUrl')
    .then(url => cy.visitAsRecurringUser(url, options))
})

Cypress.Commands.add('visitProductDetailPage', (options?) => {
  if (options?.categoryUrl) {
    cy.wrap<string>(options.categoryUrl)
      .as('categoryEntryPointUrl')
    cy.visitAsRecurringUser(options.categoryUrl, _.omit(options, ['categoryUrl']))
  } else {
    cy.visitCategoryPage(options)
  }

  cy.registerStockApiRequest()

  cy.getByTestId('ProductTile')
    .random()
    .findByTestId('productLink')
    .click()
})

Cypress.Commands.add('getCategoryEntryPointUrl', () => {
  cy.get<string>('@categoryEntryPointUrl')
})

Cypress.Commands.add('getStoreCode', () => {
  cy.get<string>('@storeCode')
})

Cypress.Commands.add('setStoreCode', (storeCode?: string | boolean) => {
  const storeCodes: string[] = Settings.availableStoreViews
  if (!storeCode || !storeCodes.includes(storeCode as string)) {
    storeCode = storeCodes[Math.floor(Math.random() * (storeCodes.length - 1))]
  }

  cy.wrap(storeCode).as('storeCode')
})

Cypress.Commands.add('openSidebar', (trigger: string = '[data-test-id="HeaderButtonSidebar"]', overlaySelector: string = '[data-test-id="Sidebar"]') => {
  cy.get(trigger)
    .should('be.visible')
    .click()

  cy.get(overlaySelector)
    .as('sidebar')
    .should('be.visible')
})

Cypress.Commands.add('closeSidebar', (alias: string = '@sidebar') => {
  cy.get(alias).findByTestId('closeButton').click()
  cy.get(alias).should('not.exist')
})

Cypress.Commands.add('openFilterSidebar', () => {
  cy.openSidebar('[data-test-id="ButtonFilter"]')
})

Cypress.Commands.add('registerCustomer', (options) => {
  const { storeCode } = Object.assign({ storeCode: undefined }, options)
  cy.visitAsRecurringUser('/', { storeCode })
  cy.createCustomerWithFaker()

  cy.openSidebar('[data-test-id="HeaderButtonAccount"]', '[data-test-id="Modal"]')
    .get('@sidebar')
    .findByTestId('registerLink')
    .click()

  cy.getByTestId('Register')
    .find('form').as('form')
    .should('be.visible')

  cy.getCustomer().then(customer => {
    cy.get('@form').focusInput('email').type(customer.email)
    cy.get('@form').focusInput('first-name').type(customer.firstName)
    cy.get('@form').focusInput('last-name').type(customer.lastName)
    cy.get('@form').find('select[name="gender"]').selectRandomOption(true)
    cy.get('@form').focusInput('dob').type(customer.dob)
    cy.get('@form').focusInput('password').type(customer.password)
    cy.get('@form').focusInput('password-confirm').type(customer.password)
    cy.get('@form').findByTestId('newsletterCheckbox').randomlyClickElement()
    cy.get('@form').findByTestId('registerSubmit').click()
  })

  cy.waitForLoader()
    .checkNotification('success')
})

Cypress.Commands.add('registerCustomerWithAddress', (storeCode) => {
  cy.registerCustomer({ storeCode })
  cy.isLoggedIn()
  cy.addCustomerAddress()
})

Cypress.Commands.add('addCustomerAddress', () => {
  cy.openSidebar('[data-test-id="HeaderButtonAccount"]')
  cy.get('@sidebar').findByTestId('MyAddressesButton').click()

  cy.getByTestId('MyAddresses').should('be.visible')

  cy.getByTestId('AddNewAddressButton').click()
  cy.getByTestId('MyAddressesForm').as('form').should('be.visible')

  cy.getFaker().then(faker => {
    if (faker.random.number(1) > 0) {
      cy.get('@form').focusInput('company').type(faker.company.companyName())
    }

    cy.get('@form').focusInput('street[0]').type(faker.address.streetAddress())
    cy.get('@form').focusInput('city').type(faker.address.city())
    cy.get('@form').focusInput('postcode').type(faker.address.zipCode())

    cy.getStoreCode().then(storeCode => {
      if (storeCode === 'fr') {
        cy.get('@form').focusInput('telephone').type(faker.phone.phoneNumber())
      } else if (['uk', 'us'].includes(storeCode)) {
        cy.get('@form').find('select[name="region_id"]').selectRandomOption(true)
      }
    })

    cy.get('@form').findByTestId('IsDefaultBillingCheckbox').randomlyClickElement()
    cy.get('@form').findByTestId('IsDefaultShippingCheckbox').randomlyClickElement()
    cy.get('@form').findByTestId('SubmitButton').click()

    cy.waitForLoader().checkNotification('success')

    cy.get('@form').findByTestId('BackButton').click()

    cy.getByTestId('MyAddresses')
      .should('be.visible')
      .findByTestId('AddressBox')
  })
})

Cypress.Commands.add('getCustomer', () => {
  cy.get<Cypress.Customer>('@customer')
})

Cypress.Commands.add('isLoggedIn', (status: boolean = true) => {
  cy.getByTestId('HeaderButtonAccount')
    .as('accountButton')

  cy.get('@accountButton').should('have.class', status ? 'logged-in' : 'logged-out')
})

Cypress.Commands.add('acceptCookieNotice', () => {
  localStorage.setItem(
    'shop/uniClaims/cookiesAccepted',
    `{ "code": "cookiesAccepted", "created_at": "${new Date().toISOString()}", "value": true }`
  )
})

Cypress.Commands.add('hideLanguageModal', () => {
  cy.getStoreCode().then(storeCode => {
    /**
     * It's very important to be aware to use valid JSON.
     * Took me two hours to find out that I had missing quotes on two values.
     */
    localStorage.setItem(
      'shop/uniClaims/languageAccepted',
      `{ "code": "languageAccepted", "created_at": "${new Date().toISOString()}", "value": { "accepted": true, "storeCode": "${storeCode}" } }`
    )
  })
})

Cypress.Commands.add('waitForLoader', timeout => {
  cy.wrap(`Wait for ${timeout / 1000}s until the loader disappears`).debug()
  cy.getByTestId('Loader')
    .should('be.visible')
  cy.getByTestId('Loader', { timeout })
    .should('not.exist')
})

Cypress.Commands.add('checkNotification', (status: string) => {
  const map: Record<string, string> = {
    'success': 't-bg-alt-3',
    'error': 't-bg-alert',
    'warning': 't-bg-alt-2',
    'info': 't-bg-alt-2'
  }

  cy.wrap(Object.keys(map)).should('include', status)

  cy.getByTestId('NotificationItem')
    .first()
    .should('be.visible')
    .should('have.class', map[status])

  cy.getByTestId('NotificationItemMessage').invoke('text')
})

Cypress.Commands.add('getBrowserLanguage', () => {
  cy.window().then(win => {
    const navigator: any = win.navigator
    let languages: string[] = []

    if (navigator.languages) {
      navigator.languages.forEach((l: string) => languages.push(l))
    }
    if (navigator.userLanguage) {
      languages.push(navigator.userLanguage);
    }
    if (navigator.language) {
      languages.push(navigator.language);
    }

    cy.wrap(win.navigator.language)
      .as('browserLanguage')
    cy.wrap(languages)
      .as('browserLanguages')
    cy.wrap(win.navigator.language.split('-')[0].toLocaleLowerCase())
      .as('browserStoreCode')
  })
})

Cypress.Commands.add('findImageWithPlaceholder', { prevSubject: 'element' }, (subject, selector: string = 'img') => {
  cy.wrap(subject).find(selector + ':not(.t-hidden)')
})

Cypress.Commands.add('registerStockApiRequest', () => {
  cy.intercept({ method: 'GET', pathname: '/api/stock/check*' })
    .as('apiStockReq')
})

Cypress.Commands.add('checkStockApiRequest', () => {
  cy.wait('@apiStockReq')
    .its('response')
    .then(response => {
      if (
        response.statusCode === 200 &&
        response.body.result.is_in_stock === true &&
        response.body.result.qty > 1
      ) {
        cy.wrap(true).as('availability')
      } else {
        cy.wrap(false).as('availability')
      }
    })
})

Cypress.Commands.add('checkAvailabilityOfCurrentProduct', (closeSidebar = false) => {
  cy.checkStockApiRequest()
  cy.wait(300) // Wait for DOM change

  cy.getByTestId('AddToCart').then($button => {
    if ($button.attr('disabled')) {
      cy.wrap(false).as('availability')
    } else {
      cy.getByTestId('product').then($product => {
        if ($product.find('[data-test-id="AddToCartSize"]').length) {
          cy.wrap('configurable').as('productType')
          cy.openSidebar('[data-test-id="AddToCartSize"]')

          cy.selectRandomProductOptionInSidebar()
            .checkStockApiRequest()

          if (closeSidebar) {
            cy.get('@sidebar').findByTestId('closeButton').click()
          }
        } else {
          cy.wrap('simple').as('productType')
          cy.wrap(true).as('availability')
        }
      })
    }
  })
})

Cypress.Commands.add('checkAvailabilityOfCurrentProductInSidebar', (closeSidebar = false) => {
  cy.wrap('configurable').as('productType')
  cy.selectRandomProductOptionInSidebar()
    .checkStockApiRequest()
})

Cypress.Commands.add('addRandomProductToCart', (options?: { categoryUrl?: string, tries: number, enterCheckout?: boolean }, count: number = 1) => {
  options = Object.assign({ tries: 3, enterCheckout: false }, options)
  let { tries, enterCheckout } = options

  if (count > tries) {
    expect(true).to.be.equal(false, 'No buyable products found')
  } else {
    cy.log(`Try to find product which is in stock ${count}/${tries}`)
  }

  const categoryUrl = options.categoryUrl ? { categoryUrl: options.categoryUrl } : {}
  cy.visitProductDetailPage(categoryUrl)
  cy.checkAvailabilityOfCurrentProduct()

  cy.get<boolean>('@availability')
    .then(available => {
      if (!available) {
        cy.addRandomProductToCart({ tries, enterCheckout }, count + 1)
      } else {
        cy.addCurrentProductToCart(false, enterCheckout)
      }
    })
})

Cypress.Commands.add('selectRandomProductOptionInSidebar', () => {
  cy.get<'configurable'|'simple'>('@productType')
    .then(type => {
      if (type === 'configurable') {
        cy.get('@sidebar').findByTestId('DefaultSelector')
          .filter('.available')
          .random()
          .then($item => {
            cy.wrap<string>($item.find('span').first().text().trim()).as('optionLabel')
            cy.wrap($item)
          })
          .click({ force: true })
      }
    })
})

Cypress.Commands.add('addCurrentProductToCart', (checkAvailability = true, enterCheckout = false) => {
  if (checkAvailability) {
    cy.checkAvailabilityOfCurrentProduct()
  }

  cy.get('@availability').should('be.true')

  cy.get<'configurable'|'simple'>('@productType')
    .then(type => {
      if (type === 'configurable') {
        cy.get<string>('@optionLabel').then(label => {
          if (!label) {
            cy.selectRandomProductOptionInSidebar()
          }

          cy.getByTestId('AddToCartSize').contains(label)
        })

        cy.get('@sidebar').findByTestId('AddToCart')
          .should('not.be.disabled')
          .click()

        cy.get('@sidebar')
          .should('not.be.visible')
      } else {
        cy.getByTestId('AddToCart')
          .click()
      }
    })

  cy.checkNotification('success')
  cy.getByTestId('MicroCart')
    .should('be.visible')

  if (enterCheckout) {
    cy.getByTestId('MicroCart').findByTestId('GoToCheckout')
      .should('be.visible')
      .click()
  }
})

Cypress.Commands.add('focusInput', { prevSubject: 'element' }, (subject, id, options) => {
  cy.wrap(subject)
    .find('input[name="' + id + '"]', options)
    .focus()
})

Cypress.Commands.add('createCartAndGoToCheckout', (storeCode) => {
  cy.visitAsRecurringUser('/', { storeCode })
  cy.addRandomProductToCart({ enterCheckout: true })
  cy.createCustomerWithFaker()
})

Cypress.Commands.add('checkoutGoToNextStep', { prevSubject: 'element' }, (subject, waitForLoader = true) => {
  cy.wrap(subject)
    .findByTestId('NextStepButton').click()

  if (waitForLoader) {
    cy.waitForLoader()
  }
})

Cypress.Commands.add('checkoutFillPersonalDetails', (createNewAccount: boolean = false) => {
  cy.getCustomer().then(customer => {
    cy.get('#checkout .step-personal .personal-details').as('personal-details')

    cy.get('@personal-details').focusInput('email').type(customer.email)
    cy.get('@personal-details').focusInput('first-name').type(customer.firstName)
    cy.get('@personal-details').focusInput('last-name').type(customer.lastName)

    if (createNewAccount) {
      cy.get('@personal-details').findByTestId('CreateAccountCheckbox')
        .should('be.visible')
        .click()

      cy.get('@personal-details').find('select[name="gender"]')
        .should('be.visible')
        .selectRandomOption(true)

      cy.get('@personal-details').focusInput('dob').type(customer.dob)
      cy.get('@personal-details').focusInput('password').type(customer.password)
      cy.get('@personal-details').focusInput('password-confirm').type(customer.password)
    }

    cy.get('@personal-details').checkoutGoToNextStep(false)
  })
})

Cypress.Commands.add('checkoutFillAddress', (selectExistingAddress = false) => {
  cy.get('#checkout .step-addresses .addresses').as('addresses')

  if (selectExistingAddress) {
    cy.get('@addresses').get('.address-shipping')
      .should('be.visible')
  } else {
    cy.get('@addresses').get('.address-shipping')
      .should('be.visible')
      .checkoutFillNewAddressForm()
  }

  cy.get('@addresses').checkoutGoToNextStep()
})

Cypress.Commands.add('checkoutFillNewAddressForm', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).as('address')

  cy.getCustomer().then(customer => {
    cy.get('@address').focusInput('street[0]').type(customer.address.streetAddress())
    cy.get('@address').focusInput('postcode').type(customer.address.zipCode())
    cy.get('@address').focusInput('city').type(customer.address.city())

    cy.getStoreCode().then(storeCode => {
      if (['uk'].includes(storeCode)) {
        cy.get('@address').find('select[name="region_id"]').selectRandomOption(true)
      }
      if (storeCode === 'fr') {
        cy.get('@address').focusInput('telephone').type(customer.phone.phoneNumber())
      }
    })
  })
})

Cypress.Commands.add('checkoutFillShipping', () => {
  cy.getStoreCode().then(storeCode => {
    if (storeCode === 'de') {
      cy.get('#checkout .step-shipping .shipping').as('shipping')
      cy.get('@shipping').find('label[for="priorityHandling"]').randomlyClickElement()

      cy.get('@shipping').checkoutGoToNextStep()
    }
  })
})

Cypress.Commands.add('checkoutFillPayment', (method, proceed = true) => {
  cy.get('#checkout .step-payment .payment').as('payment')

  cy.get('@payment').findByTestId(method + 'Checkbox').click()
  cy.get('@payment').findByTestId(method + 'Form').should('be.visible')

  if (proceed) {
    cy.get('@payment').checkoutGoToNextStep()
  }
})

Cypress.Commands.add('checkoutPlaceOrder', (isGateway = false) => {
  cy.get('#checkout .step-review .order-review').as('review')

  cy.get('@review').then(body => {
    if (body.find('label[for="terms"]').length > 0) {
      cy.get('label[for="terms"]').click(5, 5)
    }
  })

  cy.get('@review').findByTestId('PlaceOrderButton').click()

  cy.waitForLoader(45000)

  if (!isGateway) {
    cy.url().should('include', `checkout-success`)
  }
})

/**
 * More infos about how to handle iframes
 * @see https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
 * @see https://medium.com/@michabahr/testing-stripe-elements-with-cypress-5a2fc17ab27b
 */
Cypress.Commands.add('getFrame', { prevSubject: 'element' }, (subject, selector = '') => {
  return cy.wrap(subject)
    .find('iframe' + selector)
    .iframeLoaded()
    .then(cy.wrap)
    .its('body')
    .should('not.be.undefined')
})

Cypress.Commands.add('iframeLoaded', { prevSubject: 'element' }, ($iframe) => {
  const $contentWindow = () => $iframe[0]?.contentDocument || $iframe[0]?.contentWindow?.document
  return new Promise(resolve => {
    if ($contentWindow()?.readyState === 'complete') {
      resolve($contentWindow())
    } else {
      $iframe.on('load', () => {
        resolve($contentWindow())
      })
    }
  })
})

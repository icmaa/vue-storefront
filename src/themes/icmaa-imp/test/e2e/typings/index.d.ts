declare namespace Cypress {

  interface ExtVisitOptions extends VisitOptions {
    storeCode: string
  }

  interface VisitProductDetailsOptions extends ExtVisitOptions {
    categoryUrl: string
  }

  interface Customer extends Faker.FakerStatic {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dob: string
  }

  interface Chainable<Subject> {

    /**
     * Get faker instance from alias.
     * Adds alias `customer` for further use.
     *
     * @example
     * cy.getFaker()
     */
    getFaker(): Chainable<Faker.FakerStatic>,

    /**
     * Create a customer object for current storeview and register it as alias.
     *
     *
     * @example
     * cy.createCustomerWithFaker()
     */
    createCustomerWithFaker(): Chainable<Customer>,

    /**
     * Get random element from previous element.
     *
     * @example
     * cy.random()
     */
    random(): Chainable<any>,

    /**
     * Click a random element of specific selector.
     *
     * @example
     * cy.clickRandomElement()
     */
    clickRandomElement(): Chainable<Element>,

    /**
     * Select a random option from a select.
     *
     * @example
     * cy.selectRandomOption()
     */
    selectRandomOption(skipFirst?: boolean): Chainable<Element>,

    /**
     * Click or don't click on an element.
     *
     * @example
     * cy.randomlyClickElement()
     */
    randomlyClickElement(): Chainable<Element>,

    /**
     * Get item by data-test-id attribute.
     *
     * @example
     * cy.getByTestId('Modal')
     */
    getByTestId(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<any>>,

    /**
     * Find child items by data-test-id attribute.
     *
     * @example
     * cy.findByTestId('Modal')
     */
    findByTestId(selector: string): Chainable<JQuery<any>>,

    /**
     * Return item from localstorage
     *
     * @example
     * cy.getFromLocalStorage('shop/uniClaims/reviewsClaimAccepted')
     */
    getFromLocalStorage(key: string): Chainable<string>,

    /**
     * Check image for visibility and dimensions.
     *
     * @example
     * cy.get('img').checkImage()
     */
    checkImage(): Chainable<any>,

    /**
     * Visit the given url.
     * Adds alias `storeCode` for further use.
     *
     * @param {string} url The URL to visit. If relative uses `baseUrl`
     * @param {VisitOptions} [options] Pass in an options object to change the default behavior of `cy.visit()`
     * @see https://on.cypress.io/visit
     * @example
     *    cy.visit('http://localhost:3000')
     *    cy.visit('/somewhere') // opens ${baseUrl}/somewhere
     *    cy.visit({
     *      url: 'http://google.com',
     *      method: 'POST'
     *    })
     *
     */
    visit(url: string, options?: Partial<ExtVisitOptions>): Chainable<Window>,
    visit(options: Partial<ExtVisitOptions> & { url: string }): Chainable<Window>,

    /**
     * Visit a page as recurring visitor.
     * Adds alias `storeCode` for further use.
     *
     * @example
     * cy.visitAsRecurringUser()
     * cy.visitAsRecurringUser('/merchandise', { storeCode: 'de' })
     */
    visitAsRecurringUser(url: string, options?: Partial<ExtVisitOptions>): Chainable<Window>,
    visitAsRecurringUser(options: Partial<ExtVisitOptions> & { url: string }): Chainable<Window>,

    /**
     * Visit a random category page as recurring visitor.
     * Adds alias `storeCode` for further use.
     * Adds alias `categoryEntryPointUrl` for further use.
     *
     * @example
     * cy.visitCategoryPage()
     * cy.visitCategoryPage({ url: '/new', storeCode: 'de' })
     */
    visitCategoryPage(options?: Partial<ExtVisitOptions>): Chainable<Window>,

    /**
     * Visit a random product page from random or specific category as recurring visitor.
     *
     * @example
     * cy.visitProductDetailPage()
     * cy.visitProductDetailPage({ categoryUrl: 'girls.html', storeCode: 'de' })
     */
    visitProductDetailPage(options?: Partial<VisitProductDetailsOptions>): Chainable<Window>,

    /**
     * Get entry point category path from `categoryEntryPointUrl` alias.
     *
     * @example
     * cy.getCategoryEntryPointUrl()
     */
    getCategoryEntryPointUrl(): Chainable<string>,

    /**
     * Get current string value of `storeCode` alias.
     *
     * @example
     * cy.getStoreCode()
     */
    getStoreCode(): Chainable<string>,

    /**
     * Set specific or random store-code.
     * Adds alias `storeCode` for further use.
     *
     * @example
     * cy.setStoreCode()
     * cy.setStoreCode('de')
     */
    setStoreCode(storeCode?: string | boolean): Chainable<Window>,

    /**
     * Open sidebar.
     * Adds alias `sidebar` for further use.
     *
     * @example
     * cy.openSidebar()
     * cy.openSidebar('[data-test-id="HeaderButtonWishlist"]')
     * cy.openSidebar('[data-test-id="HeaderButtonAccount"]', '[data-test-id="Modal"]')
     */
    openSidebar(triggerSelector?: string, overlaySelector?: string): Chainable<Window>,

    /**
     * Close sidebar.
     *
     * @example
     * cy.closeSidebar()
     * cy.closeSidebar('@sidebarB')
     */
    closeSidebar(alias?: string): Chainable<Window>,

    /**
     * Open filter sidebar.
     * Adds alias `sidebar` for further use.
     *
     * @example
     * cy.openFilterSidebar()
     */
    openFilterSidebar(): Chainable<Window>,

    /**
     * Register a new customer using the registration routine.
     * Adds alias `customer` for further use of customer object.
     *
     * @example
     * cy.registerCustomer()
     * cy.registerCustomer({ storeCode: 'de' })
     */
    registerCustomer(options?: { storeCode?: string }): Chainable<Window>,

    /**
     * Register a new customer using the registration routine and create a default address.
     * Adds alias `customer` for further use.
     *
     * @example
     * cy.registerCustomerWithAddress()
     * cy.registerCustomerWithAddress('fr')
     */
    registerCustomerWithAddress(storeCode?: string): Chainable<Window>,

    /**
     * Add an address to current customer. The customer must be already logged in.
     * Adds alias `customer` for further use.
     *
     * @example
     * cy.addCustomerAddress()
     */
    addCustomerAddress(): Chainable<Window>,

    /**
     * Get current customer object from `customer` alias.
     *
     * @example
     * cy.getCustomer()
     */
    getCustomer(): Chainable<Customer>,

    /**
     * Check if user is logged-in or not.
     *
     * @example
     * cy.isLoggedIn()
     * cy.isLoggedIn(false)
     */
    isLoggedIn(status?: boolean): Chainable<Window>,

    /**
     * Accept cookie-consent using Usercentrics API
     * @see https://docs.usercentrics.com/#/cmp-v2-ui-api
     *
     * @example
     * cy.acceptCookieConsent()
     */
    acceptCookieConsent(): Chainable<Window>,

    /**
     * Set local storage to mark language modal as clicked away.
     *
     * @example
     * cy.hideLanguageModal()
     */
    hideLanguageModal(): Chainable<Window>,

    /**
     * Check if loader is appearing and disappearing.
     *
     * @example
     * cy.waitForLoader()
     * cy.waitForLoader(1000)
     */
    waitForLoader(timeout?: number): Chainable<Window>,

    /**
     * Check for notification and its status and returns.
     *
     * @example
     * cy.checkNotification()
     */
    checkNotification(status: 'success' | 'error' | 'warning' | 'info'): Chainable<string>,

    /**
     * Gets browser language from window object.
     * Adds alias `browserLanguage` and `browserStoreCode` for further use.
     *
     * @example
     * cy.getBrowserLanguage()
     */
    getBrowserLanguage(): Chainable<Window>,

    /**
     * Find child image but wait for placeholder to disappear.
     *
     * @example
     * cy.findImageWithPlaceholder()
     */
    findImageWithPlaceholder(selector?: string): Chainable<any>,

    /**
     * Check availability of current product.
     * Adds alias `apiStockReq` for further use.
     *
     * @example
     * cy.registerStockApiRequest()
     * //...
     * cy.wait('@apiStockReq')
     */
    registerStockApiRequest(): Chainable<Window>,

    /**
     * Check response of latest product stock api request.
     * Uses alias `apiStockReq` therefore `cy.registerStockApiRequest()` must be used before.
     * Adds alias `availability` for further use.
     *
     * @example
     * cy.checkStockApiRequest()
     */
    checkStockApiRequest(): Chainable<Window>,

    /**
     * Check availability of current product on PDP.
     * Its important that the `registerStockApiRequest` is called to register the stock-api route before the PDP is opened.
     * Adds alias `availability` for further use.
     * Adds alias `productType` for further use.
     *
     * @example
     * cy.checkAvailabilityOfCurrentProduct()
     * cy.checkAvailabilityOfCurrentProduct(true)
     */
    checkAvailabilityOfCurrentProduct(closeSidebar?: boolean): Chainable<Window>,

    /**
     * Check availability of current product in sidebar.
     * Its important that the `registerStockApiRequest` is called to register the stock-api route before the PDP is opened.
     * Adds alias `availability` for further use.
     * Adds alias `productType` for further use.
     *
     * @example
     * cy.checkAvailabilityOfCurrentProductInSidebar()
     * cy.checkAvailabilityOfCurrentProductInSidebar(true)
     */
    checkAvailabilityOfCurrentProductInSidebar(closeSidebar?: boolean): Chainable<Window>,

    /**
     * Select a random product option add-to-cart sidebar.
     * Adds alias `availability` for further use.
     * Adds alias `productType` for further use.
     *
     * @example
     * cy.selectRandomProductOptionInSidebar()
     */
    selectRandomProductOptionInSidebar(): Chainable<Window>,

    /**
     * Try to add random product to cart. Retries if product is unavailable or out-of-stock.
     * Works with simple and configurable products.
     *
     * @example
     * cy.addRandomProductToCart()
     * cy.addRandomProductToCart({ tries: 10 })
     */
    addRandomProductToCart(options?: { categoryUrl?: string, tries?: number, enterCheckout?: boolean }, count?: number): Chainable<Window>,

    /**
     * Try to add the product you are currently viewing to cart.
     * Works with simple and configurable products.
     *
     * @example
     * cy.addCurrentProductToCart()
     * cy.addCurrentProductToCart(false)
     */
    addCurrentProductToCart(checkAvailability?: boolean, enterCheckout?: boolean): Chainable<Window>,

    /**
     * Create a new user-session, add a random product to cart and enter checkout.
     * Adds alias `customer` for further use.
     *
     * @example
     * cy.createACartAndGoToCheckout()
     */
    createCartAndGoToCheckout(storeCode?: string): Chainable<Window>,

    /**
     * Get input by name and focus it
     * @param name Name of input-field to focus
     *
     * @example
     * cy.focusInput('Modal')
     */
    focusInput<E extends Node = HTMLElement>(name: string, options?: Partial<Loggable & Timeoutable & Shadow>): Chainable<JQuery<E>>,

    /**
     * Click on next-step button in checkout
     * Need @customer alias to be already defined
     *
     * @example
     * cy.checkoutGoToNextStep()
     * cy.checkoutGoToNextStep(false)
     */
    checkoutGoToNextStep<E extends Node = HTMLElement>(waitForLoader?: boolean): Chainable<JQuery<E>>,

    /**
     * Fills out personal-details step in checkout
     * Need @customer alias to be already defined
     *
     * @example
     * cy.checkoutFillPersonalDetails()
     * cy.checkoutFillPersonalDetails(true)
     */
    checkoutFillPersonalDetails(createNewAccount?: boolean): Chainable<Window>,

    /**
     * Fills out a new address in address step in checkout or select an existing address
     * Need @customer alias to be already defined if you enter a new address
     *
     * @example
     * cy.checkoutFillAddress()
     * cy.checkoutFillAddress(true)
     */
    checkoutFillAddress(selectExistingAddress?: boolean): Chainable<Window>,

    /**
     * Fills out parent address from in address checkout step
     * Need @customer alias to be already defined
     *
     * @example
     * cy.checkoutFillNewAddressForm()
     */
    checkoutFillNewAddressForm<E extends Node = HTMLElement>(waitForLoader?: boolean): Chainable<JQuery<E>>,

    /**
     * Fills out shipping step in checkout and randomly selects priority-handling.
     * By default all store-views only have one shipping-method and therefore prefill
     * and "skip" this step. Only in the /de store you can select the prio-handling
     * and an action will be required.
     *
     * @example
     * cy.checkoutFillShipping()
     */
    checkoutFillShipping(): Chainable<Window>,

    /**
     * Fills out payment step in checkout.
     * If `proceed` is true then it assumes that there are no inputs necessary and proceeds
     * to the next step.
     *
     * @example
     * cy.checkoutFillPayment('Bankpayment')
     * cy.checkoutFillPayment('CheckoutcomApmGiropay', false)
     */
    checkoutFillPayment(method: string, proceed?: boolean): Chainable<Window>,

    /**
     * Ticks all necessary checkboxes inside the review-step and places the order.
     *
     * @example
     * cy.checkoutPlaceOrder()
     * cy.checkoutPlaceOrder(true)
     */
    checkoutPlaceOrder(isGateway?: boolean): Chainable<Window>,

    /**
     * Get and wait for child iframe
     *
     * @example
     * cy.get('div').getFrame()
     * cy.get('div').getFrame('.aut-iframe')
     */
    getFrame<E extends Node = HTMLElement>(selector?: string): Chainable<JQuery<E>>,

    /**
     * Check if iframe is loaded
     *
     * @example
     * cy.iframeLoaded('Modal')
     */
    iframeLoaded<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & Shadow>): Chainable<JQuery<E>>
  }
}

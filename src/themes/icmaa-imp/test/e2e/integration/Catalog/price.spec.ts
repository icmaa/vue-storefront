interface PriceDTO {
  price: string,
  originalPrice: boolean|string
}

const stripPrice = (price: string): string => {
  const regex = /^([a-zA-Z\s]*)/g
  return price.replace(regex, '').trim()
}

const collectPriceFromDOM = ($parent: JQuery<HTMLElement>): PriceDTO => {
  const $specialPrice = $parent.find('.price-special')
  const $originalPrice = $parent.find('.price-original')
  const $regularPrice = $parent.find('.price')

  let priceDTO: PriceDTO = { price: '', originalPrice: false }

  if ($specialPrice.length) {
    priceDTO.price = stripPrice($specialPrice.text())
    priceDTO.originalPrice = stripPrice($originalPrice.text())
  } else {
    priceDTO.price = stripPrice($regularPrice.text())
  }

  return priceDTO
}

describe('Price', () => {
  it('Follow product and check price', () => {
    cy.visitCategoryPage()

    cy.getByTestId('ProductTile')
      .random()
      .then($product => {
        cy.wrap<PriceDTO>(collectPriceFromDOM($product)).as('listPrice')
        cy.wrap($product)
      })
      .click()

    cy.getByTestId('price').then($price => {
      cy.wrap<PriceDTO>(collectPriceFromDOM($price)).as('detailsPrice')
    })

    cy.get<PriceDTO>('@listPrice').then(listPrice => {
      cy.get<PriceDTO>('@detailsPrice').its('price').should('eq', listPrice.price)
      cy.get<PriceDTO>('@detailsPrice').its('originalPrice').should('eq', listPrice.originalPrice)

      cy.get<PriceDTO>('@detailsPrice').then(detailsPrice => {
        expect(detailsPrice).to.deep.equal(listPrice)
      })
    })

    // @todo: Add add-to-cart routing like in add-to-cart and check price in cart
    // cy.addCurrentProductToCart()
  })
})
